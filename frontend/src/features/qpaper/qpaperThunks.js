import { createAsyncThunk } from "@reduxjs/toolkit";
import { qpaperApi } from "@/api";
import { setCurrentPaper, setGenerating, setError } from "./qpaperSlice";

export const generatePaper = createAsyncThunk("qpaper/generate", async (payload, { dispatch }) => {
  dispatch(setGenerating(true));
  try {
    const { data } = await qpaperApi.generate(payload);
    dispatch(setCurrentPaper(data));
    return data;
  } catch (err) {
    dispatch(setError(err.response?.data?.detail || "Generation failed"));
    throw err;
  } finally {
    dispatch(setGenerating(false));
  }
});
