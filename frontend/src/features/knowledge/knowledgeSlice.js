import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  documents: [],
  searchResults: [],
  isLoading: false,
  error: null,
};

const knowledgeSlice = createSlice({
  name: "knowledge",
  initialState,
  reducers: {
    setDocuments: (state, action) => { state.documents = action.payload; },
    setSearchResults: (state, action) => { state.searchResults = action.payload; },
    setLoading: (state, action) => { state.isLoading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    clearSearch: (state) => { state.searchResults = []; },
  },
});

export const { setDocuments, setSearchResults, setLoading, setError, clearSearch } = knowledgeSlice.actions;
export default knowledgeSlice.reducer;
