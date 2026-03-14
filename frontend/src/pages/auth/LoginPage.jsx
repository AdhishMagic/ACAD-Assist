export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 p-8 border rounded-lg bg-card">
        <h1 className="text-2xl font-bold text-center">Sign In</h1>
        <p className="text-center text-muted-foreground">Welcome back to ACAD-Assist</p>
        {/* LoginForm component will be rendered here */}
      </div>
    </div>
  );
}
