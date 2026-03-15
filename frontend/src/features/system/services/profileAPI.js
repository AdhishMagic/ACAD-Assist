import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

export const profileAPI = {
  getProfile: async () => {
    // const response = await api.get('/user/profile');
    // return response.data;
    
    // Mock user
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          id: "u123",
          name: "Alex Developer",
          email: "alex@example.com",
          role: "Student",
          joinDate: "2025-09-01",
          avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
          stats: {
            coursesEnrolled: 4,
            notesSaved: 12,
            testsTaken: 3
          }
        });
      }, 300);
    });
  },
  updateProfile: async (data) => {
    // const response = await api.put('/user/profile', data);
    // return response.data;
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  },
  updatePassword: async (data) => {
    // const response = await api.put('/user/password', data);
    // return response.data;
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  }
};
