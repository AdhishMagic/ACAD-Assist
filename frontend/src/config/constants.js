export const APP_NAME = "ACAD-Assist";
export const API_TIMEOUT = 15000;
export const AI_TIMEOUT = 60000;
export const ITEMS_PER_PAGE = 10;
export const MAX_FILE_SIZE_MB = 50;
export const SUPPORTED_FILE_TYPES = [".pdf", ".docx", ".txt", ".pptx", ".md"];
export const AI_MODELS = [
  { id: "phi-3-mini", name: "Phi-3 Mini", description: "Fast, lightweight model" },
  { id: "llama-3", name: "LLaMA 3", description: "Balanced performance" },
  { id: "mistral-7b", name: "Mistral 7B", description: "High quality responses" },
];
export const DIFFICULTY_LEVELS = ["easy", "medium", "hard", "expert"];
export const QUESTION_TYPES = ["mcq", "short_answer", "long_answer", "true_false", "fill_in_blank"];
