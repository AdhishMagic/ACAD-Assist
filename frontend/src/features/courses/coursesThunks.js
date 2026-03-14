import { createAsyncThunk } from "@reduxjs/toolkit";
import { coursesApi } from "@/api";
import { setCourses, setCurrentCourse, setLoading, setError } from "./coursesSlice";

export const fetchCourses = createAsyncThunk("courses/fetchAll", async (params, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const { data } = await coursesApi.getAll(params);
    dispatch(setCourses(data.results || data));
    return data;
  } catch (err) {
    dispatch(setError(err.response?.data?.detail || "Failed to fetch courses"));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
});

export const fetchCourseById = createAsyncThunk("courses/fetchById", async (id, { dispatch }) => {
  dispatch(setLoading(true));
  try {
    const { data } = await coursesApi.getById(id);
    dispatch(setCurrentCourse(data));
    return data;
  } catch (err) {
    dispatch(setError(err.response?.data?.detail || "Failed to fetch course"));
    throw err;
  } finally {
    dispatch(setLoading(false));
  }
});
