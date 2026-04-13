import React from "react";
import ErrorPage from "@/pages/ErrorPage";
import { notificationService } from "@/services/notification.service";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    notificationService.error(error?.message || "Unexpected application error");
  }

  render() {
    if (this.state.hasError) {
      return <ErrorPage />;
    }

    return this.props.children;
  }
}
