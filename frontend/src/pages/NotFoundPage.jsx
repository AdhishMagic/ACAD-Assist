import { Link } from "react-router-dom";
import { useHomePath } from "@/features/auth/hooks/useHomePath";

export default function NotFoundPage() {
  const homePath = useHomePath();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
      <p className="text-xl text-muted-foreground">Page not found</p>
      <Link to={homePath} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Go Home</Link>
    </div>
  );
}
