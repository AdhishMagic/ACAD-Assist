import axios from 'axios';

// Ideally, create an axios instance with base URL and interceptors.
// Assuming your project has a pre-configured axios client, you might import it instead.
// For now, we use standard axios or a mock if the endpoint isn't ready.

// Replace with your actual configured backend client if you have one, e.g. import axiosClient from '@/lib/axios';

const BASE_URL = '/api/teacher';

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

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve({ 
        success: true, 
        examId: 'exam-xyz123',
        questions: [
          {
            id: 'q1',
            type: 'MCQ',
            text: 'What is the primary function of the mitochondria?',
            options: ['Energy production', 'Protein synthesis', 'Waste removal', 'Cell division'],
            correctAnswer: 'Energy production',
            marks: 1,
            difficulty: 'Easy'
          },
          {
            id: 'q2',
            type: 'Short Answer',
            text: 'Define photosynthesis in your own words.',
            marks: 3,
            difficulty: 'Medium'
          }
        ]
      }), 3000);
    });
  },

  getExamPreview: async (examId) => {
    // const { data } = await axios.get(`${BASE_URL}/exam-preview/${examId}`);
    // return data;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        id: examId,
        title: 'Mid-term Biology Exam',
        instructions: 'Answer all questions. Calculators are not allowed.',
        totalMarks: 50,
        duration: 90,
        questions: [
          {
            id: 'q1',
            type: 'MCQ',
            text: 'What is the primary function of the mitochondria?',
            options: ['Energy production', 'Protein synthesis', 'Waste removal', 'Cell division'],
            correctAnswer: 'Energy production',
            marks: 1,
            difficulty: 'Easy'
          },
          {
            id: 'q2',
            type: 'Short Answer',
            text: 'Define photosynthesis in your own words.',
            marks: 3,
            difficulty: 'Medium'
          }
        ]
      }), 1000);
    });
  },

  exportExam: async ({ examId, format }) => {
    // const { data } = await axios.get(`${BASE_URL}/exam-export/${examId}?format=${format}`, {
    //   responseType: format === 'online' ? 'json' : 'blob'
    // });
    // return data;

    // Mock implementation
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, message: `Exam exported as ${format}`, url: `/downloads/exam_${examId}.${format}` }), 1500);
    });
  }
};
