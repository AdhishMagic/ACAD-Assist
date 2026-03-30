export function FilterToolbar({ children }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}
