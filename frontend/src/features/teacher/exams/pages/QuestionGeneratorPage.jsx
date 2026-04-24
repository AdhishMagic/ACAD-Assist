import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROUTE_PATHS } from '@/app/routes/routePaths';

const QuestionGeneratorPage = () => {
  return <Navigate to={ROUTE_PATHS.TEACHER_QUESTION_PAPER} replace />;
};

export default QuestionGeneratorPage;
