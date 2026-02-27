import React from "react";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="empty">
      <div className="empty__icon" aria-hidden="true">🧾</div>
      <div className="empty__title">{title}</div>
      <div className="empty__desc">{description}</div>
    </div>
  );
}