import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  papers: [],
  currentPaper: null,
  isGenerating: false,
  error: null,
};

const qpaperSlice = createSlice({
  name: "qpaper",
  initialState,
  reducers: {
    setPapers: (state, action) => { state.papers = action.payload; },
    setCurrentPaper: (state, action) => { state.currentPaper = action.payload; },
    setGenerating: (state, action) => { state.isGenerating = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    clearCurrentPaper: (state) => { state.currentPaper = null; },
  },
});

export const { setPapers, setCurrentPaper, setGenerating, setError, clearCurrentPaper } = qpaperSlice.actions;
export default qpaperSlice.reducer;
