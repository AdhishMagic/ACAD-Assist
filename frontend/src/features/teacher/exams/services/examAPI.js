import { aiAPI } from '@/features/ai/services/aiAPI';
import { loadTemplateDraft, saveTemplateDraft } from '../utils/templateStorage';
import { jsPDF } from 'jspdf';
import { apiClient } from '@/shared/lib/http/axios';
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

const EXAM_STORAGE_PREFIX = 'acadassist.teacher.generatedExam.v1.';
const TEMPLATE_STORAGE_KEY = 'acadassist.teacher.latestTemplateId';
const UPLOAD_STORAGE_KEY = 'acadassist.teacher.latestUpload.v1';

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

const flattenQuestionsFromSections = (sections) => {
  if (!Array.isArray(sections)) return [];
  return sections.flatMap((section) => {
    const sectionName = section?.title || section?.name || 'Questions';
    const questions = Array.isArray(section?.questions) ? section.questions : [];
    return questions.map((question, index) => ({
      id: question?.id || `${sectionName}-${index + 1}`,
      text: question?.text || question?.prompt || '',
      marks: question?.marks || section?.marksPerQuestion || 0,
      type: question?.type || section?.questionType || 'Short Answer',
      options: Array.isArray(question?.options) ? question.options : [],
      sectionName,
    }));
  });
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
  const draft = config?.templateDraft || loadTemplateDraft() || {};

  const templateDuration = safeParseInt(draft?.duration, 60);
  const duration = templateDuration;

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

const saveLatestTemplateId = (templateId) => {
  if (!templateId) return;
  try {
    localStorage.setItem(TEMPLATE_STORAGE_KEY, String(templateId));
  } catch {
    // ignore
  }
};

const loadLatestTemplateId = () => {
  try {
    return localStorage.getItem(TEMPLATE_STORAGE_KEY);
  } catch {
    return null;
  }
};

const buildTemplatePayload = (templateData = {}) => ({
  title: templateData.examTitle || templateData.title || 'Question Paper Template',
  pattern_json: {
    examTitle: templateData.examTitle || templateData.title || 'Question Paper Template',
    duration: safeParseInt(templateData.duration, 60),
    sections: Array.isArray(templateData.sections) ? templateData.sections : [],
  },
});

const normalizeSubject = (subject = {}) => ({
  id: subject?.id ? String(subject.id) : '',
  name: subject?.name || 'Unnamed Subject',
  code: subject?.code || '',
});

const normalizeUnit = (unit) => {
  if (typeof unit === 'string') {
    return { id: unit, label: unit };
  }
  return {
    id: String(unit?.id || unit?.label || ''),
    label: unit?.label || unit?.name || String(unit?.id || ''),
  };
};

const normalizeTemplate = (template = {}) => ({
  id: template?.id ? String(template.id) : '',
  title: template?.title || 'Question Paper Template',
  patternJson: template?.pattern_json || { sections: [] },
  sectionCount: safeParseInt(template?.section_count, 0),
  createdAt: template?.created_at || null,
  updatedAt: template?.updated_at || null,
});

const normalizeExamRecord = (exam = {}) => ({
  id: exam?.id,
  title: exam?.title || exam?.exam_json?.title || 'Question Paper Draft',
  subject: exam?.subject || exam?.subject_ref?.name || '',
  subjectRef: normalizeSubject(exam?.subject_ref || {}),
  lessonRange: exam?.lesson_range || {},
  difficulty: normalizeDifficulty(exam?.difficulty, 'Medium'),
  status: exam?.status || 'draft',
  templateId: exam?.template?.id || exam?.template || null,
  examJson: exam?.exam_json || {},
  createdAt: exam?.created_at || null,
  updatedAt: exam?.updated_at || null,
});

const normalizeUploadResult = (item = {}) => ({
  id: item?.id || item?.file_id || null,
  originalName: item?.original_name || '',
  fileType: item?.file_type || '',
  fileUrl: item?.file_url || null,
  extractedContent: item?.extracted_content || '',
  titleSuggestion: item?.title_suggestion || '',
  templateSuggestion: item?.template_suggestion || null,
  createdAt: item?.created_at || null,
});

const saveLatestUpload = (upload) => {
  if (!upload) return;
  try {
    localStorage.setItem(UPLOAD_STORAGE_KEY, JSON.stringify(upload));
  } catch {
    // ignore
  }
};

export const loadLatestUpload = () => {
  try {
    const raw = localStorage.getItem(UPLOAD_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const extractJsonFromText = (text) => {
  const value = String(text || '').trim();
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    // continue
  }

  const fenced = value.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {
      // continue
    }
  }

  const firstBrace = value.indexOf('{');
  const lastBrace = value.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    try {
      return JSON.parse(value.slice(firstBrace, lastBrace + 1));
    } catch {
      return null;
    }
  }

  return null;
};

export const examAPI = {
  getSubjects: async () => {
    const { data } = await apiClient.get('/api/exam/catalog/subjects/');
    return Array.isArray(data) ? data.map(normalizeSubject) : [];
  },

  getUnitsForSubject: async (subjectId) => {
    if (!subjectId) return [];
    const { data } = await apiClient.get(`/api/exam/catalog/subjects/${subjectId}/units/`);
    return Array.isArray(data?.units) ? data.units.map(normalizeUnit) : [];
  },

  getTemplates: async () => {
    const { data } = await apiClient.get('/api/exam/templates/');
    return Array.isArray(data) ? data.map(normalizeTemplate) : [];
  },

  getExamDrafts: async (params = {}) => {
    const { data } = await apiClient.get('/api/exam/', { params });
    return Array.isArray(data) ? data.map(normalizeExamRecord) : [];
  },

  uploadMaterial: async (formData) => {
    const { data } = await apiClient.post('/api/files/upload/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const normalized = normalizeUploadResult(data);
    if (normalized?.templateSuggestion) {
      saveTemplateDraft(normalized.templateSuggestion);
    }
    saveLatestUpload(normalized);
    return normalized;
  },

  saveTemplate: async (templateData) => {
    const payload = buildTemplatePayload(templateData);
    const { data } = await apiClient.post('/api/exam/templates/', payload);
    saveLatestTemplateId(data?.id);
    return {
      success: true,
      templateId: data?.id,
      templateData: data,
    };
  },

  generateExam: async (config) => {
    const templateDraft = loadTemplateDraft() || {};
    let templateId = config?.templateId || loadLatestTemplateId();

    if (!templateId) {
      const savedTemplate = await examAPI.saveTemplate(templateDraft);
      templateId = savedTemplate?.templateId;
    }

    const examId = `exam-${Date.now()}`;
    const effectiveTemplateDraft = {
      ...(config?.selectedTemplate?.patternJson || {}),
      ...templateDraft,
      sections:
        (Array.isArray(config?.selectedTemplate?.patternJson?.sections) && config.selectedTemplate.patternJson.sections.length > 0)
          ? config.selectedTemplate.patternJson.sections
          : (Array.isArray(templateDraft?.sections) ? templateDraft.sections : []),
      examTitle:
        config?.selectedTemplate?.patternJson?.examTitle
        || config?.selectedTemplate?.title
        || templateDraft?.examTitle
        || templateDraft?.title
        || 'Generated Exam',
    };
    const exam = buildExamFromTemplateDraft({ examId, config: { ...config, templateDraft: effectiveTemplateDraft } });
    saveGeneratedExam(exam);

    const payload = {
      subject_id: config?.subjectId || null,
      subject: config?.subjectName || templateDraft.examTitle || 'Generated Exam',
      title: effectiveTemplateDraft.examTitle || `${config?.subjectName || 'Subject'} Question Paper`,
      lesson_range: {
        subject_id: config?.subjectId || null,
        subject_name: config?.subjectName || '',
        start_unit: config?.lessonRange?.startUnit || '',
        end_unit: config?.lessonRange?.endUnit || '',
        selected_units: Array.isArray(config?.lessonRange?.selectedUnits) ? config.lessonRange.selectedUnits : [],
      },
      difficulty: normalizeDifficulty(config?.difficulty, 'Medium'),
      template: templateId,
      exam_json: exam,
    };

    const { data } = await apiClient.post('/api/exam/generate/', payload);
    const persistedExamId = data?.id || data?.exam_id || exam.id;
    const persistedExam = {
      ...exam,
      id: persistedExamId,
      title: data?.title || exam.title,
    };
    saveGeneratedExam(persistedExam);

    return {
      success: true,
      examId: persistedExamId,
      exam: normalizeExamRecord(data),
    };
  },

  getExamPreview: async (examId) => {
    try {
      const { data } = await apiClient.get(`/api/exam/${examId}/`);
      const sectionQuestions = flattenQuestionsFromSections(data?.exam_json?.sections);
      const explicitQuestions = Array.isArray(data?.exam_json?.questions) ? data.exam_json.questions : [];
      const questions = explicitQuestions.length ? explicitQuestions : sectionQuestions;
      const normalized = normalizeExamForDisplay({
        id: data?.id,
        title: data?.title || data?.exam_json?.title || data?.subject || 'Generated Exam',
        duration: safeParseInt(data?.exam_json?.duration, 60),
        instructions: data?.exam_json?.instructions || 'Answer all questions.',
        totalMarks: safeParseInt(data?.exam_json?.totalMarks, 0),
        questions,
        subject: data?.subject || '',
        subjectId: data?.subject_ref?.id || '',
        lessonRange: data?.lesson_range || {},
        difficulty: data?.difficulty || 'Medium',
        templateId: data?.template?.id || null,
        status: data?.status || 'draft',
      });
      saveGeneratedExam(normalized);
      return normalized;
    } catch (error) {
      const stored = loadGeneratedExam(examId);
      if (stored) {
        const normalized = normalizeExamForDisplay(stored);
        saveGeneratedExam(normalized);
        return normalized;
      }
      throw error;
    }
  },

  updateExam: async ({ examId, exam }) => {
    const payload = {
      title: exam?.title || 'Question Paper Draft',
      subject: exam?.subject || '',
      subject_id: exam?.subjectId || undefined,
      lesson_range: exam?.lessonRange || {},
      difficulty: normalizeDifficulty(exam?.difficulty, 'Medium'),
      template: exam?.templateId,
      exam_json: exam,
      status: exam?.status || 'draft',
    };
    const { data } = await apiClient.patch(`/api/exam/${examId}/`, payload);
    const normalized = normalizeExamForDisplay({
      id: data?.id,
      title: data?.title || data?.exam_json?.title || 'Generated Exam',
      duration: safeParseInt(data?.exam_json?.duration, 60),
      instructions: data?.exam_json?.instructions || 'Answer all questions.',
      totalMarks: safeParseInt(data?.exam_json?.totalMarks, 0),
      questions: Array.isArray(data?.exam_json?.questions)
        ? data.exam_json.questions
        : flattenQuestionsFromSections(data?.exam_json?.sections),
    });
    saveGeneratedExam(normalized);
    return normalized;
  },

  polishExamWithAI: async ({ examId, exam, instruction }) => {
    const prompt = [
      'You are editing a question paper draft.',
      'Return only valid JSON.',
      'Preserve the schema with keys: title, duration, instructions, totalMarks, questions.',
      'Each question must keep: id, text, marks, type, options, sectionName, difficulty.',
      `Teacher instruction: ${instruction || 'Improve clarity and correctness.'}`,
      `Current draft JSON:\n${JSON.stringify(exam, null, 2)}`,
    ].join('\n\n');

    const aiResult = await aiAPI.chat({
      content: prompt,
      title: 'Question Paper AI Edit',
      entryPoint: 'question-paper-generator',
    });

    const parsed = extractJsonFromText(aiResult?.content);
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('AI response did not return valid exam JSON.');
    }

    const polishedExam = normalizeExamForDisplay({
      ...exam,
      ...parsed,
      questions: Array.isArray(parsed?.questions) ? parsed.questions : exam?.questions || [],
    });

    return examAPI.updateExam({
      examId,
      exam: {
        ...polishedExam,
        subject: exam?.subject || '',
        subjectId: exam?.subjectId || '',
        lessonRange: exam?.lessonRange || {},
        difficulty: exam?.difficulty || 'Medium',
        templateId: exam?.templateId,
        status: exam?.status || 'draft',
      },
    });
  },

  exportExam: async ({ examId, format }) => {
    // Mock implementation (client-side export)
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const exam = loadGeneratedExam(examId) || buildExamFromTemplateDraft({ examId, config: { useTemplate: true } });
          const titleSlug = slugify(exam?.title);

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

          reject(new Error(`Unsupported export format: ${format}`));
        } catch (e) {
          reject(e);
        }
      })();
    });
  }
};
