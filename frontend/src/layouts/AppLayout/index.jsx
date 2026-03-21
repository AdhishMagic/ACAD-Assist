import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col border-r border-border">
        <div className="flex flex-col flex-1 overflow-y-auto p-4">
          <h1 className="text-xl font-bold text-primary mb-8">ACAD-Assist</h1>
          <nav className="space-y-2">
            <a href="/" className="block px-3 py-2 rounded-md hover:bg-accent text-sm">Dashboard</a>
            <a href="/courses" className="block px-3 py-2 rounded-md hover:bg-accent text-sm">Courses</a>
            <a href="/ai" className="block px-3 py-2 rounded-md hover:bg-accent text-sm">AI Assistant</a>
            <a href="/qpaper/generate" className="block px-3 py-2 rounded-md hover:bg-accent text-sm">Question Paper</a>
            <a href="/settings" className="block px-3 py-2 rounded-md hover:bg-accent text-sm">Settings</a>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <div className="text-lg font-semibold">Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Welcome back</span>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
