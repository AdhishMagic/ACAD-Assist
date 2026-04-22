import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/store/authSlice";
import coursesReducer from "@/features/courses/coursesSlice";
import aiReducer from "@/features/ai/aiSlice";
import qpaperReducer from "@/features/qpaper/qpaperSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  courses: coursesReducer,
  ai: aiReducer,
  qpaper: qpaperReducer,
});

export default rootReducer;
