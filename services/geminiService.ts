import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion } from '../types';

// NOTE: API Key is accessed via process.env.API_KEY as per instructions.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a structured study response for a given topic.
 */
export const generateStudyContent = async (
  topic: string,
  subjectName: string
): Promise<string> => {
  try {
    const prompt = `
      You are an expert professor at Anna University. The student is studying "${subjectName}".
      The topic is: "${topic}".
      
      Please provide a structured response in Markdown format containing:
      1. **Study Roadmap**: A quick step-by-step guide to mastering this concept.
      2. **Concept Explanation**: Clear, academic explanation.
      3. **Exam Focus**:
         - **2-Mark Answer**: A concise, standard definition or answer (approx 30-50 words).
         - **16-Mark Answer Structure**: An outline of how to write a detailed answer (Introduction, Diagram references, Derivation steps, Key points, Conclusion).
      
      Keep the tone academic yet encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Sorry, I couldn't generate the content at this moment.";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error generating study content. Please check your connection.";
  }
};

/**
 * Generates a quiz based on a subject.
 */
export const generateQuiz = async (subjectName: string, topic?: string): Promise<QuizQuestion[]> => {
  try {
    const prompt = topic
      ? `Generate 5 multiple-choice questions for the topic "${topic}" in the subject "${subjectName}" suitable for engineering students.`
      : `Generate 5 multiple-choice questions for the subject "${subjectName}" suitable for engineering students.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING },
            },
            required: ["question", "options", "correctAnswer", "explanation"],
          },
        },
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as QuizQuestion[];
    }
    return [];
  } catch (error) {
    console.error("Gemini Quiz Error:", error);
    return [];
  }
};

/**
 * Generates narrative audio explanation using TTS.
 */
export const generateNarrativeAudio = async (
  topic: string,
  subjectName: string
): Promise<string | null> => {
  try {
    const prompt = `
      Explain the concept of "${topic}" in the subject "${subjectName}" like a storyteller. 
      Use a narrative style to help an engineering student understand the intuition behind the concept.
      Keep it under 1 minute of speech.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: prompt,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio || null;
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return null;
  }
};