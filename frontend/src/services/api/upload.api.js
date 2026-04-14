import { apiClient } from "@/shared/lib/http/axios";

export async function uploadFile(formData, onUploadProgress) {
  const response = await apiClient.post("/api/files/upload/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });

  return response.data;
}
