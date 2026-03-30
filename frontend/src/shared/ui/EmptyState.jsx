export function EmptyState({ title = "No data", description = "Nothing to show right now." }) {
  return (
    <div className="rounded-lg border border-dashed p-8 text-center">
      <p className="text-base font-semibold">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
