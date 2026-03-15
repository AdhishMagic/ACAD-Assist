import axios from 'axios';

// Base API setup, assuming generic /api prefix
const apiClient = axios.create({
  baseURL: '/api'
});

// Mock data to prevent proxy ECONNREFUSED errors when backend is not running
const MOCK_NOTES = [
  { id: 1, title: 'Introduction to Algorithms', subject: 'Computer Science', author: 'Dr. Smith', createdAt: '2026-03-10T10:00:00Z', isBookmarked: true, tags: ['Important', 'Exam Prep'], readTime: 12, previewImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop', excerpt: 'A comprehensive overview of sorting and searching algorithms starting with Big O notation.' },
  { id: 2, title: 'Cell Biology Notes', subject: 'Biology', author: 'Prof. Johnson', createdAt: '2026-03-12T14:30:00Z', isBookmarked: false, tags: ['Reading Material'], readTime: 8, excerpt: 'Detailed structure of eukaryotic cells, focusing on the mitochondria and nucleus.' },
  { id: 3, title: 'World War II Summary', subject: 'History', author: 'Ms. Davis', createdAt: '2026-03-14T09:15:00Z', isBookmarked: true, tags: ['Lecture', 'Important'], readTime: 15, excerpt: 'Key events leading up to the war, major theaters of conflict, and the aftermath.' },
  { id: 4, title: 'Calculus III Formulas', subject: 'Mathematics', author: 'Mr. Wilson', createdAt: '2026-03-15T08:00:00Z', isBookmarked: false, tags: ['Assignment'], readTime: 5, excerpt: 'Cheat sheet for multivariable calculus including gradient, divergence, and curl.' }
];

const MOCK_SUBJECT_NOTES = [
  { id: 101, title: 'Network Topologies', subject: 'Computer Networks', author: 'Dr. Alan', createdAt: '2026-03-01T10:00:00Z', isBookmarked: true, tags: ['Important'], readTime: 10 },
  { id: 102, title: 'OSI Model Deep Dive', subject: 'Computer Networks', author: 'Dr. Alan', createdAt: '2026-03-05T14:30:00Z', isBookmarked: false, tags: ['Exam Prep'], readTime: 15 },
];

const MOCK_NOTE_DETAILS = {
  id: 1,
  title: 'Understanding React Server Components',
  subject: 'Frontend Engineering',
  author: 'Dan Abramov',
  createdAt: '2026-03-12T10:00:00Z',
  isBookmarked: true,
  tags: ['React', 'Architecture', 'Performance'],
  content: `
# React Server Components (RSC)

Server Components allow us to render components on the server, sending zero JavaScript to the client. This results in faster page loads and a smaller bundle size.

## Why RSC?
1. **Zero Bundle Size Impact**: Dependencies imported in Server Components are not included in the client bundle.
2. **Direct Backend Access**: Safely access databases and file systems directly from your components.
3. **Automatic Code Splitting**: Client components are automatically code-split by default.

### Example Server Component

\`\`\`jsx
import db from './db';

// This component runs uniquely on the server
export default async function NoteList() {
  const notes = await db.notes.getAll();
  return (
    <ul>
      {notes.map(note => (
        <li key={note.id}>{note.title}</li>
      ))}
    </ul>
  );
}
\`\`\`

> Note: Server components cannot use state or effects directly.

### Table of Constraints
| Feature | Server Components | Client Components |
|---|---|---|
| Use State | No | Yes |
| Use Effects | No | Yes |
| DOM Event Listeners | No | Yes |
| Access Backend API | Yes | No (requires fetch) |

Get started building modern full-stack React applications!
  `,
  relatedNotes: [
    { title: 'Advanced Hooks Pattern', id: 'hooks-1' },
    { title: 'Concurrent Mode Deep Dive', id: 'concurrent-1' }
  ]
};

// Simulated network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const notesAPI = {
  getAllNotes: async (params) => {
    try {
      if (import.meta.env.VITE_USE_MOCK_API === 'true' || true) { // Force mock for now
        await delay(500);
        return { notes: MOCK_NOTES };
      }
      const response = await apiClient.get('/notes', { params });
      return response.data;
    } catch (error) {
      console.warn("API Error, falling back to mock data");
      return { notes: MOCK_NOTES };
    }
  },
  
  getNotesBySubject: async (subjectId, params) => {
    try {
      if (true) {
        await delay(500);
        return { notes: MOCK_SUBJECT_NOTES };
      }
      const response = await apiClient.get(`/notes/subject/${subjectId}`, { params });
      return response.data;
    } catch (error) {
      return { notes: MOCK_SUBJECT_NOTES };
    }
  },
  
  getNoteById: async (noteId) => {
    try {
      if (true) {
        await delay(500);
        return MOCK_NOTE_DETAILS;
      }
      const response = await apiClient.get(`/notes/${noteId}`);
      return response.data;
    } catch (error) {
      return MOCK_NOTE_DETAILS;
    }
  },
  
  toggleBookmark: async (noteId) => {
    try {
      if (true) {
        await delay(300);
        return { success: true };
      }
      const response = await apiClient.post(`/notes/${noteId}/bookmark`);
      return response.data;
    } catch (error) {
      return { success: true };
    }
  }
};
