import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import coursesReducer from "@/features/courses/coursesSlice";
import aiReducer from "@/features/ai/aiSlice";
import knowledgeReducer from "@/features/knowledge/knowledgeSlice";
import qpaperReducer from "@/features/qpaper/qpaperSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
  ai: aiReducer,
  knowledge: knowledgeReducer,
  qpaper: qpaperReducer,
});

export default rootReducer;
