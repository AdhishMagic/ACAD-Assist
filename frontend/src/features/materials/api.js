import apiClient from "@/shared/lib/http/axios";

export async function createMaterial({ title, content, file }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);

  if (file) {
    formData.append("file", file);
  }

  const { data } = await apiClient.post("/api/materials/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function updateMaterial(id, { title, content, file }) {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("content", content);

  if (file) {
    formData.append("file", file);
  }

  const { data } = await apiClient.put(`/api/materials/${id}/`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
}

export async function getMyMaterials() {
  const { data } = await apiClient.get("/api/materials/");
  return data;
}

export async function getMaterialById(id) {
  const { data } = await apiClient.get(`/api/materials/${id}/`);
  return data;
}

export async function publishMaterial(id) {
  const { data } = await apiClient.patch(`/api/materials/${id}/publish/`);
  return data;
}

export async function getPublicMaterials() {
  const { data } = await apiClient.get("/api/materials/public/");
  return data;
}

// Backward compatible aliases used by existing components.
export const listMaterials = getMyMaterials;
export const getMaterial = getMaterialById;

export async function listMaterialsLibrary() {
  const { data } = await apiClient.get("/api/materials/library/");
  return data;
}

export async function listBookmarkedMaterials() {
  const { data } = await apiClient.get("/api/materials/bookmarks/");
  return data;
}

export async function bookmarkMaterial(id) {
  const { data } = await apiClient.post(`/api/materials/${id}/bookmark/`);
  return data;
}

export async function unbookmarkMaterial(id) {
  await apiClient.delete(`/api/materials/${id}/bookmark/`);
}
