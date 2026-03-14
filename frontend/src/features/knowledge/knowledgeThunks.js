import { createAsyncThunk } from "@reduxjs/toolkit";
import { ragService } from "@/api";
import { setSearchResults, setLoading, setError } from "./knowledgeSlice";

export const searchDocuments = createAsyncThunk("knowledge/search", async (query, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const { data } = await ragService.query({ query });
    dispatch(setSearchResults(data.results || data));
    return data;
  } catch (err) {
    dispatch(setError(err.response?.data?.detail || "Search failed"));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
});
