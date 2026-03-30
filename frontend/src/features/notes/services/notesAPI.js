import { apiClient } from '@/shared/lib/http/axios';
import { isMockMode } from '@/shared/lib/http/apiMode';

// Mock data to prevent proxy ECONNREFUSED errors when backend is not running
const MOCK_NOTES = [
  { id: 1, title: 'Introduction to Data Structures', subject: 'Data Structures', author: 'Dr. Smith', createdAt: '2026-03-10T10:00:00Z', popularity: 82, isBookmarked: true, tags: ['Important', 'Exam Prep'], readTime: 12, previewImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=300&fit=crop', excerpt: 'Core concepts: arrays, linked lists, stacks, queues, trees, and hash tables.' },
  { id: 2, title: 'Organic Chemistry Notes', subject: 'Chemistry', author: 'Prof. Johnson', createdAt: '2026-03-12T14:30:00Z', popularity: 61, isBookmarked: false, tags: ['Reading Material'], readTime: 8, excerpt: 'Functional groups, isomerism, and reaction basics with examples.' },
  { id: 3, title: 'OSI Model Summary', subject: 'Computer Networks', author: 'Ms. Davis', createdAt: '2026-03-14T09:15:00Z', popularity: 90, isBookmarked: true, tags: ['Lecture', 'Important'], readTime: 15, excerpt: 'A clear breakdown of layers, protocols, and troubleshooting tips.' },
  { id: 4, title: 'Calculus III Formulas', subject: 'Mathematics', author: 'Mr. Wilson', createdAt: '2026-03-15T08:00:00Z', popularity: 75, isBookmarked: false, tags: ['Assignment'], readTime: 5, excerpt: 'Cheat sheet for multivariable calculus including gradient, divergence, and curl.' },
  { id: 5, title: 'Classical Mechanics Cheat Sheet', subject: 'Physics', author: 'Dr. Smith', createdAt: '2026-03-16T11:20:00Z', popularity: 69, isBookmarked: false, tags: ['Exam Prep'], readTime: 9, excerpt: 'Newton’s laws, work-energy, momentum, and rotational dynamics.' }
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

const slugify = (value = '') => {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

const applyNotesQuery = (notes = [], params = {}) => {
  const search = (params?.search || '').trim().toLowerCase();
  const sort = params?.sort || 'newest';
  const teachers = params?.filters?.teachers || [];
  const tags = params?.filters?.tags || [];

  let result = Array.isArray(notes) ? [...notes] : [];

  if (search) {
    result = result.filter((note) => {
      const haystack = [
        note?.title,
        note?.subject,
        note?.author,
        ...(note?.tags || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(search);
    });
  }

  if (Array.isArray(teachers) && teachers.length > 0) {
    result = result.filter((note) => teachers.includes(note?.author));
  }

  if (Array.isArray(tags) && tags.length > 0) {
    result = result.filter((note) => {
      const noteTags = note?.tags || [];
      return tags.some((t) => noteTags.includes(t));
    });
  }

  if (sort === 'alphabetical') {
    result.sort((a, b) => String(a?.title || '').localeCompare(String(b?.title || '')));
  } else if (sort === 'popular') {
    result.sort((a, b) => (Number(b?.popularity || 0) - Number(a?.popularity || 0)));
  } else {
    // newest
    result.sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
  }

  return result;
};

export const notesAPI = {
  getAllNotes: async (params) => {
    try {
      if (isMockMode) {
        await delay(150);
        return { notes: applyNotesQuery(MOCK_NOTES, params) };
      }
      const response = await apiClient.get('/notes', { params });
      return response.data;
    } catch (error) {
      console.warn("API Error, falling back to mock data");
      return { notes: applyNotesQuery(MOCK_NOTES, params) };
    }
  },
  
  getNotesBySubject: async (subjectId, params) => {
    try {
      if (isMockMode) {
        await delay(150);
        const subjectSlug = slugify(subjectId);
        const subjectNotes = MOCK_NOTES.filter((n) => slugify(n?.subject) === subjectSlug);
        return { notes: applyNotesQuery(subjectNotes, params) };
      }
      const response = await apiClient.get(`/notes/subject/${subjectId}`, { params });
      return response.data;
    } catch (error) {
      const subjectSlug = slugify(subjectId);
      const subjectNotes = MOCK_NOTES.filter((n) => slugify(n?.subject) === subjectSlug);
      return { notes: applyNotesQuery(subjectNotes, params) };
    }
  },
  
  getNoteById: async (noteId) => {
    try {
      if (isMockMode) {
        await delay(150);
        const numericId = Number(noteId);
        const base = MOCK_NOTES.find((n) => String(n.id) === String(noteId) || (Number.isFinite(numericId) && n.id === numericId));

        if (!base) {
          return MOCK_NOTE_DETAILS;
        }

        return {
          ...MOCK_NOTE_DETAILS,
          id: base.id,
          title: base.title,
          subject: base.subject,
          author: base.author,
          createdAt: base.createdAt,
          isBookmarked: base.isBookmarked,
          tags: base.tags || MOCK_NOTE_DETAILS.tags,
          excerpt: base.excerpt || MOCK_NOTE_DETAILS.excerpt,
        };
      }
      const response = await apiClient.get(`/notes/${noteId}`);
      return response.data;
    } catch (error) {
      return MOCK_NOTE_DETAILS;
    }
  },
  
  toggleBookmark: async (noteId) => {
    try {
      if (isMockMode) {
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
