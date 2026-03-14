import { useState, useCallback } from "react";
import { ragService } from "@/api";

export function useFileUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const upload = useCallback(async (files) => {
    setIsUploading(true);
    setError(null);
    setProgress(0);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));
      const { data } = await ragService.ingest(formData);
      setProgress(100);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || "Upload failed");
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { upload, isUploading, progress, error };
}
