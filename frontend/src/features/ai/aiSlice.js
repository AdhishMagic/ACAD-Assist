import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messages: [],
  isStreaming: false,
  error: null,
  selectedModel: "phi-3-mini",
};

const aiSlice = createSlice({
  name: "ai",
  initialState,
  reducers: {
    addMessage: (state, action) => { state.messages.push(action.payload); },
    setStreaming: (state, action) => { state.isStreaming = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    setSelectedModel: (state, action) => { state.selectedModel = action.payload; },
    clearMessages: (state) => { state.messages = []; },
  },
});

export const { addMessage, setStreaming, setError, setSelectedModel, clearMessages } = aiSlice.actions;
export default aiSlice.reducer;
