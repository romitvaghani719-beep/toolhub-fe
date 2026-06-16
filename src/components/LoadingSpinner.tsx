export default function LoadingSpinner({ label }: { label?: string }) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      {label && <span className="loading-state__label">{label}</span>}
    </div>
  );
}
