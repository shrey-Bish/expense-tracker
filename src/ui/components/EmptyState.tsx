// src/ui/components/EmptyState.tsx

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="table-empty">
      <div className="empty-illustration" aria-hidden="true">🧾</div>
      <div className="empty-title">{title}</div>
      <p className="empty-desc">{description}</p>
    </div>
  );
}