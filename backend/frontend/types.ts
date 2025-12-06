export enum Department {
  CSE = 'Computer Science & Engineering',
  ECE = 'Electronics & Comm. Engineering',
  MECH = 'Mechanical Engineering',
  EEE = 'Electrical & Electronics Engineering',
  CIVIL = 'Civil Engineering',
  AIDS = 'Artificial Intelligence & Data Science'
}

export type Semester = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface UserProfile {
  name: string;
  email: string;
  department: Department;
  semester: Semester;
  isSetupComplete: boolean;
}

export interface SyllabusUnit {
  unitNumber: string;
  title: string;
  content: string;
  periods?: number;
}

export interface Subject {
  code: string;
  name: string;
  department: Department;
  semester: Semester;
  syllabus_overview: string;
  detailed_syllabus?: SyllabusUnit[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isAudio?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export enum AppScreen {
  AUTH = 'AUTH',
  ONBOARDING = 'ONBOARDING',
  DASHBOARD = 'DASHBOARD',
  SUBJECT_DETAIL = 'SUBJECT_DETAIL',
  SETTINGS = 'SETTINGS'
}

export enum SubjectTab {
  SYLLABUS = 'SYLLABUS',
  IMPORTANT_QS = 'IMPORTANT_QS',
  REFERENCES = 'REFERENCES',
  QUIZ = 'QUIZ',
  CHAT = 'CHAT'
}