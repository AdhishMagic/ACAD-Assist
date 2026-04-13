import { projectsApi } from '@/services/api';

export const projectAPI = {
  submitProject: async (payload) => {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('file', payload.file);
    const response = await projectsApi.submit(formData);
    return response.data;
  },

  getMyProjects: async () => {
    const response = await projectsApi.my();
    return response.data;
  },
};
