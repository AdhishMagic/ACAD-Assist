import { createAsyncThunk } from "@reduxjs/toolkit";
import { aiService } from "@/api";
import { addMessage, setStreaming, setError } from "./aiSlice";

export const sendMessage = createAsyncThunk("ai/sendMessage", async (payload, { dispatch }) => {
  dispatch(addMessage({ role: "user", content: payload.message }));
  dispatch(setStreaming(true));
  try {
    const { data } = await aiService.chat(payload);
    dispatch(addMessage({ role: "assistant", content: data.response }));
    return data;
  } catch (err) {
    dispatch(setError(err.response?.data?.detail || "AI service error"));
    throw err;
  } finally {
    dispatch(setStreaming(false));
  }
});
