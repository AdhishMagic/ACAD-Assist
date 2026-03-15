import axios from "axios";

const api = axios.create({
  baseURL: "/api"
});

export const searchAPI = {
  globalSearch: async (query) => {
    if (!query) return { results: [] };
    // const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
    // return response.data;
    
    // Mock response
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          results: [
            { id: "n1", type: "notes", title: "React Fundamentals", description: "Introduction to React and hooks", url: "/knowledge/n1" },
            { id: "c1", type: "courses", title: "Advanced Frontend Development", description: "Mastering modern web development", url: "/courses/c1" },
            { id: "t1", type: "tests", title: "Midterm React Exam", description: "Covers weeks 1-4", url: "/qpaper/t1" },
            { id: "u1", type: "users", title: "Jane Doe", description: "Senior React Engineer", url: "/profile/u1" }
          ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()) || item.description.toLowerCase().includes(query.toLowerCase()))
        });
      }, 400);
    });
  }
};
