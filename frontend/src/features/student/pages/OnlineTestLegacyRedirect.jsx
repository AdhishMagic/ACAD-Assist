import React from 'react';
import { Navigate, useParams } from 'react-router-dom';

const OnlineTestLegacyRedirect = () => {
  const { examId } = useParams();
  return <Navigate to={`/online-test/${examId}`} replace />;
};

export default OnlineTestLegacyRedirect;
