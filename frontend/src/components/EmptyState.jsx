export function EmptyState({ title, description }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      <p className="muted">{description}</p>
    </div>
  );
}
