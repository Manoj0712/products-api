import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { ProductDetail } from "../components/ProductDetail.jsx";

export function ProductDetailPage({ detailState, onBack }) {
  return (
    <main className="page-grid page-grid--detail">
      <section className="surface">
        <button className="button button--ghost" onClick={onBack}>
          Back to catalog
        </button>
        <ErrorBanner message={detailState.error} />
        {detailState.loading ? <p className="status-text">Loading product detail...</p> : null}
        {detailState.product ? <ProductDetail product={detailState.product} /> : null}
      </section>
    </main>
  );
}
