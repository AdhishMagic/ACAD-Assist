import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  pagination: { page: 1, totalPages: 1, totalCount: 0 },
};

const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action) => { state.courses = action.payload; },
    setCurrentCourse: (state, action) => { state.currentCourse = action.payload; },
    setLoading: (state, action) => { state.isLoading = action.payload; },
    setError: (state, action) => { state.error = action.payload; },
    clearError: (state) => { state.error = null; },
  },
});

export const { setCourses, setCurrentCourse, setLoading, setError, clearError } = coursesSlice.actions;
export default coursesSlice.reducer;
