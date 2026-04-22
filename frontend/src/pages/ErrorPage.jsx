import { Link, useInRouterContext } from "react-router-dom";
import { useHomePath } from "@/features/auth/hooks/useHomePath";

export default function ErrorPage() {
  const hasRouterContext = useInRouterContext();
  const homePath = useHomePath();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-destructive">Something went wrong</h1>
      <p className="text-muted-foreground">An unexpected error occurred</p>
      {hasRouterContext ? (
        <Link to={homePath} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Go Home</Link>
      ) : (
        <a href={homePath} className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm">Go Home</a>
      )}
    </div>
  );
}
