import axios from 'axios';
import { loadTemplateDraft } from '../utils/templateStorage';
import { jsPDF } from 'jspdf';
import {
  Document as DocxDocument,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from 'docx';

// Ideally, create an axios instance with base URL and interceptors.
// Assuming your project has a pre-configured axios client, you might import it instead.
// For now, we use standard axios or a mock if the endpoint isn't ready.

// Replace with your actual configured backend client if you have one, e.g. import axiosClient from '@/lib/axios';

const BASE_URL = '/api/teacher';

const EXAM_STORAGE_PREFIX = 'acadassist.teacher.generatedExam.v1.';

const safeParseInt = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeDifficulty = (difficulty, fallback = 'Medium') => {
  const d = typeof difficulty === 'string' ? difficulty : '';
  if (d === 'Easy' || d === 'Medium' || d === 'Hard') return d;
  return fallback;
};

const normalizeQuestionType = (type) => {
  if (typeof type !== 'string') return 'Short Answer';
  if (type.toLowerCase() === 'multiple choice') return 'MCQ';
  return type;
};

const slugify = (value) => {
  const s = String(value ?? '').trim().toLowerCase();
  if (!s) return 'exam';
  return s
    .replace(/[^a-z0-9\s-_]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60);
};

const getPublishUrl = (examId) => {
  try {
    const origin = window?.location?.origin;
    if (origin) return `${origin}/online-test/${examId}`;
  } catch {
    // ignore
  }
  return `/online-test/${examId}`;
};

const formatQuestionLine = (question, index) => {
  const marks = safeParseInt(question?.marks, 0);
  const marksLabel = marks === 1 ? 'Mark' : 'Marks';
  return `Q${index}. ${question?.text ?? ''} [${marks} ${marksLabel}]`;
};

const getSectionName = (question) => {
  if (question?.sectionName) return String(question.sectionName);
  return 'Questions';
};

const groupQuestionsBySection = (questions) => {
  return (Array.isArray(questions) ? questions : []).reduce((acc, q) => {
    const key = getSectionName(q);
    if (!acc[key]) acc[key] = [];
    acc[key].push(q);
    return acc;
  }, {});
};

const normalizeExamForDisplay = (exam) => {
  if (!exam || typeof exam !== 'object') return exam;
  const questions = Array.isArray(exam.questions) ? exam.questions : [];

  const normalizedQuestions = questions.map((q) => {
    if (!q || typeof q !== 'object') return q;

    const type = normalizeQuestionType(q.type);
    const marks = safeParseInt(q.marks, 0);

    // Enforce sane minimums for specific types.
    if (type === 'Long Answer' && marks > 0 && marks < 5) {
      return { ...q, type, marks: 10 };
    }

    return { ...q, type, marks };
  });

  const totalMarks = normalizedQuestions.reduce((sum, q) => sum + (safeParseInt(q?.marks, 0) || 0), 0);

  return {
    ...exam,
    questions: normalizedQuestions,
    totalMarks,
  };
};

const exportExamToPdfBlob = async (exam) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const marginX = 48;
  const maxWidth = pageWidth - marginX * 2;
  let y = 56;

  const addWrapped = (text, fontSize = 11, lineHeight = 16) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(String(text ?? ''), maxWidth);
    for (const line of lines) {
      if (y > doc.internal.pageSize.getHeight() - 56) {
        doc.addPage();
        y = 56;
      }
      doc.text(line, marginX, y);
      y += lineHeight;
    }
  };

  doc.setFont('helvetica', 'bold');
  addWrapped(exam?.title || 'Exam Paper', 18, 22);
  doc.setFont('helvetica', 'normal');
  addWrapped(`Duration: ${safeParseInt(exam?.duration, 0)} mins`, 11, 16);
  addWrapped(`Total Marks: ${safeParseInt(exam?.totalMarks, 0)}`, 11, 18);

  if (exam?.instructions) {
    y += 8;
    doc.setFont('helvetica', 'bold');
    addWrapped('Instructions:', 12, 18);
    doc.setFont('helvetica', 'normal');
    addWrapped(exam.instructions, 11, 16);
  }

  y += 12;
  const grouped = groupQuestionsBySection(exam?.questions);
  const entries = Object.entries(grouped);
  let qn = 0;

  for (const [sectionName, sectionQuestions] of entries) {
    doc.setFont('helvetica', 'bold');
    addWrapped(sectionName, 13, 20);
    doc.setFont('helvetica', 'normal');
    y += 4;

    for (const q of sectionQuestions) {
      qn += 1;
      addWrapped(formatQuestionLine(q, qn), 11, 16);
      if (q?.type === 'MCQ' && Array.isArray(q?.options)) {
        const options = q.options.slice(0, 10);
        options.forEach((opt, idx) => {
          const label = String.fromCharCode(65 + idx);
          addWrapped(`   ${label}. ${opt}`, 10, 14);
        });
      }
      y += 6;
    }
    y += 8;
  }

  return doc.output('blob');
};

const exportExamToDocxBlob = async (exam) => {
  const children = [];

  children.push(
    new Paragraph({
      text: exam?.title || 'Exam Paper',
      heading: HeadingLevel.TITLE,
    })
  );

  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `Duration: ${safeParseInt(exam?.duration, 0)} mins`, break: 1 }),
        new TextRun({ text: `Total Marks: ${safeParseInt(exam?.totalMarks, 0)}`, break: 1 }),
      ],
    })
  );

  if (exam?.instructions) {
    children.push(new Paragraph({ text: 'Instructions', heading: HeadingLevel.HEADING_2 }));
    children.push(new Paragraph({ text: String(exam.instructions) }));
  }

  const grouped = groupQuestionsBySection(exam?.questions);
  const entries = Object.entries(grouped);
  let qn = 0;

  for (const [sectionName, sectionQuestions] of entries) {
    children.push(new Paragraph({ text: sectionName, heading: HeadingLevel.HEADING_2 }));
    for (const q of sectionQuestions) {
      qn += 1;
      children.push(new Paragraph({ text: formatQuestionLine(q, qn) }));
      if (q?.type === 'MCQ' && Array.isArray(q?.options)) {
        q.options.slice(0, 10).forEach((opt, idx) => {
          const label = String.fromCharCode(65 + idx);
          children.push(new Paragraph({ text: `${label}. ${opt}` }));
        });
      }
      children.push(new Paragraph({ text: '' }));
    }
  }

  const doc = new DocxDocument({
    sections: [{ properties: {}, children }],
  });

  return Packer.toBlob(doc);
};

const buildMockQuestion = ({
  id,
  type,
  marks,
  difficulty,
  sectionId,
  sectionName,
}) => {
  const normalizedType = normalizeQuestionType(type);
  const base = {
    id,
    type: normalizedType,
    marks,
    difficulty,
    sectionId,
    sectionName,
  };

  if (normalizedType === 'MCQ') {
    return {
      ...base,
      text: `Choose the correct option (Q${id.split('-').slice(-1)[0]}).`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 'Option A',
    };
  }

  if (normalizedType === 'Diagram') {
    return {
      ...base,
      text: `Draw and label a diagram relevant to this section (Q${id.split('-').slice(-1)[0]}).`,
    };
  }

  if (normalizedType === 'Long Answer') {
    return {
      ...base,
      text: `Explain the following in detail (Q${id.split('-').slice(-1)[0]}).`,
    };
  }

  if (normalizedType === 'Definition') {
    return {
      ...base,
      text: `Define the following term/concept (Q${id.split('-').slice(-1)[0]}).`,
    };
  }

  if (normalizedType === 'Explanation') {
    return {
      ...base,
      text: `Explain the following concept briefly (Q${id.split('-').slice(-1)[0]}).`,
    };
  }

  return {
    ...base,
    text: `Answer the following question (Q${id.split('-').slice(-1)[0]}).`,
  };
};

const buildExamFromTemplateDraft = ({ examId, config }) => {
  const draft = loadTemplateDraft();

  const templateDuration = safeParseInt(draft?.duration, 60);
  const duration = safeParseInt(config?.duration, templateDuration);

  const overallDifficulty = normalizeDifficulty(config?.difficulty, 'Medium');

  const sections = Array.isArray(draft?.sections) ? draft.sections : [];
  const questions = [];

  const sectionsToUse = sections.length
    ? sections
    : [
        {
          id: '1',
          name: 'Section A',
          questionType: 'Short Answer',
          questionCount: safeParseInt(config?.questionCount, 10),
          marksPerQuestion: 1,
          difficulty: overallDifficulty,
        },
      ];

  sectionsToUse.forEach((section, sectionIndex) => {
    const sectionId = String(section?.id ?? sectionIndex + 1);
    const sectionName = String(section?.name ?? `Section ${sectionIndex + 1}`);
    const questionType = normalizeQuestionType(section?.questionType);
    const questionCount = Math.max(0, safeParseInt(section?.questionCount, 0));
    let marksPerQuestion = Math.max(0, safeParseInt(section?.marksPerQuestion, 1));
    const sectionDifficulty = normalizeDifficulty(section?.difficulty, overallDifficulty);

    if (questionType === 'Long Answer' && marksPerQuestion > 0 && marksPerQuestion < 5) {
      marksPerQuestion = 10;
    }

    for (let i = 0; i < questionCount; i += 1) {
      const id = `${examId}-${sectionId}-${i + 1}`;
      questions.push(
        buildMockQuestion({
          id,
          type: questionType,
          marks: marksPerQuestion,
          difficulty: sectionDifficulty,
          sectionId,
          sectionName,
        })
      );
    }
  });

  const totalMarks = questions.reduce((sum, q) => sum + (safeParseInt(q.marks, 0) || 0), 0);

  return {
    id: examId,
    title: draft?.examTitle || 'Generated Exam',
    instructions: 'Answer all questions. Calculators are not allowed.',
    totalMarks,
    duration,
    questions,
  };
};

const saveGeneratedExam = (exam) => {
  try {
    localStorage.setItem(`${EXAM_STORAGE_PREFIX}${exam.id}`, JSON.stringify(normalizeExamForDisplay(exam)));
  } catch {
    // ignore
  }
};

const loadGeneratedExam = (examId) => {
  try {
    const raw = localStorage.getItem(`${EXAM_STORAGE_PREFIX}${examId}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const examAPI = {
  uploadMaterial: async (formData) => {
    // Mock response for UI building if backend is not ready
    // const { data } = await axios.post(`${BASE_URL}/upload-material`, formData, {
    //   headers: { 'Content-Type': 'multipart/form-data' }
    // });
    // return data;
    
    // Mock implementation for development
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, files: ['mock_file_parsed.pdf'], textExtracted: true }), 1500);
    });
  },

  saveTemplate: async (templateData) => {
    // const { data } = await axios.post(`${BASE_URL}/template`, templateData);
    // return data;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, templateId: 'template-123', templateData }), 800);
    });
  },

  generateExam: async (config) => {
    // const { data } = await axios.post(`${BASE_URL}/generate-exam`, config);
    // return data;

    // Mock implementation (template-driven)
    return new Promise((resolve) => {
      const examId = `exam-${Date.now()}`;
      const exam = buildExamFromTemplateDraft({ examId, config });
      saveGeneratedExam(exam);
      setTimeout(
        () =>
          resolve({
            success: true,
            examId: exam.id,
          }),
        1200
      );
    });
  },

  getExamPreview: async (examId) => {
    // const { data } = await axios.get(`${BASE_URL}/exam-preview/${examId}`);
    // return data;

    // Mock implementation (load generated exam; fallback to template-driven draft)
    return new Promise((resolve) => {
      const stored = loadGeneratedExam(examId);
      if (stored) {
        const normalized = normalizeExamForDisplay(stored);
        saveGeneratedExam(normalized);
        setTimeout(() => resolve(normalized), 300);
        return;
      }

      const exam = buildExamFromTemplateDraft({ examId, config: { useTemplate: true } });
      const normalized = normalizeExamForDisplay(exam);
      saveGeneratedExam(normalized);
      setTimeout(() => resolve(normalized), 300);
    });
  },

  exportExam: async ({ examId, format }) => {
    // const { data } = await axios.get(`${BASE_URL}/exam-export/${examId}?format=${format}`, {
    //   responseType: format === 'online' ? 'json' : 'blob'
    // });
    // return data;

    // Mock implementation (client-side export)
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const exam = loadGeneratedExam(examId) || buildExamFromTemplateDraft({ examId, config: { useTemplate: true } });
          const titleSlug = slugify(exam?.title);

          if (format === 'online') {
            resolve({
              success: true,
              message: 'Online test published',
              publishedUrl: getPublishUrl(examId),
            });
            return;
          }

          if (format === 'pdf') {
            const blob = await exportExamToPdfBlob(exam);
            resolve({
              success: true,
              message: 'PDF generated',
              blob,
              filename: `${titleSlug || 'exam'}_${examId}.pdf`,
              mimeType: 'application/pdf',
            });
            return;
          }

          if (format === 'docx') {
            const blob = await exportExamToDocxBlob(exam);
            resolve({
              success: true,
              message: 'DOCX generated',
              blob,
              filename: `${titleSlug || 'exam'}_${examId}.docx`,
              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            return;
          }

          resolve({ success: false, message: `Unknown export format: ${format}` });
        } catch (e) {
          reject(e);
        }
      })();
    });
  }
};
