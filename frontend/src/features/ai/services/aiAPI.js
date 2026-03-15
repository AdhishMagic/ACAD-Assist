import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
});

// Interceptor to handle dummy data for UI building without backend
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Return mock data for UI development
    const path = error.config?.url || '';
    const method = error.config?.method?.toLowerCase() || '';
    
    // For local development without a backend, mock everything successfully
    
    if (path.includes('/ai/history')) {
      return Promise.resolve({ data: [] });
    }
    
    if (path.includes('/ai/saved-notes')) {
      return Promise.resolve({
        data: [
          {
            id: '1',
            title: 'Photosynthesis Overview',
            topic: 'Biology',
            dateSaved: '2026-03-14T10:00:00Z',
            preview: 'Photosynthesis is a process used by plants and other organisms to convert light energy into chemical energy...',
          },
          {
            id: '2',
            title: 'Newton\'s Laws of Motion',
            topic: 'Physics',
            dateSaved: '2026-03-15T09:30:00Z',
            preview: 'First law: An object at rest remains at rest, and an object in motion remains in motion at constant speed...',
          }
        ]
      });
    }

    if (path.includes('/ai/generated/')) {
      return Promise.resolve({
        data: {
          id: '1',
          title: 'Advanced Data Structures',
          topic: 'Computer Science',
          summary: 'A comprehensive overview of trees, graphs, and hash tables.',
          definitions: [
            { term: 'Binary Tree', definition: 'A tree data structure in which each node has at most two children.' },
            { term: 'Graph', definition: 'A non-linear data structure consisting of nodes and edges.' }
          ],
          explanations: 'Data structures provide a means to manage large amounts of data efficiently for uses such as large databases and internet indexing services.',
          examples: ['AVL Tree', 'Red-Black Tree', 'Directed Acyclic Graph'],
          practiceQuestions: [
            'How do you balance a binary search tree?',
            'What is the time complexity of searching in a hash table?'
          ],
          citations: [
            { id: 1, title: 'Introduction to Algorithms', author: 'Cormen et al.', link: '#' }
          ]
        }
      });
    }

    if (error.config.url.includes('/ai/chat')) {
      return Promise.resolve({
        data: {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Here is an explanation of the topic. **Key point 1**: Understand the basics. *Note*: This is a simulated response.',
          timestamp: new Date().toISOString()
        }
      });
    }

    // Generic fallback for any other AI route to avoid connection refused errors breaking the UI
    return Promise.resolve({ data: { success: true, message: 'Mocked successful response' } });
  }
);

export const aiAPI = {
  chat: async (messages, file = null) => {
    const response = await api.post('/ai/chat', { messages });
    return response.data;
  },
  
  getHistory: async () => {
    const response = await api.get('/ai/history');
    return response.data;
  },
  
  getSavedNotes: async () => {
    const response = await api.get('/ai/saved-notes');
    return response.data;
  },
  
  getGeneratedNote: async (id) => {
    const response = await api.get(`/ai/generated/${id}`);
    return response.data;
  },

  saveNote: async (data) => {
    const response = await api.post('/ai/saved-notes', data);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await api.delete(`/ai/saved-notes/${id}`);
    return response.data;
  }
};
