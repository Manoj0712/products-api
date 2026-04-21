export function Pagination({ page, totalPages, onPrevious, onNext }) {
  return (
    <div className="pagination">
      <button className="button button--ghost" disabled={page <= 1} onClick={onPrevious}>
        Previous
      </button>
      <span className="pagination__label">
        Page {page} of {totalPages}
      </span>
      <button className="button button--ghost" disabled={page >= totalPages} onClick={onNext}>
        Next
      </button>
    </div>
  );
}
