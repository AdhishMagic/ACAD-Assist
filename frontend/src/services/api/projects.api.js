import api from "./axios";

const PROJECTS_BASE_PATH = "/api/projects";

function getProjectsUrl(path) {
  return `${PROJECTS_BASE_PATH}${path}`;
}

export const projectsApi = {
  submit: (formData) =>
    api.post(getProjectsUrl("/submit/"), formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),
  my: () => api.get(getProjectsUrl("/my/")),
  all: () => api.get(getProjectsUrl("/all/")),
  approve: (id) => api.patch(getProjectsUrl(`/${id}/approve/`)),
  reject: (id) => api.patch(getProjectsUrl(`/${id}/reject/`)),
};
