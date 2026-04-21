import { EmptyState } from "../components/EmptyState.jsx";
import { ErrorBanner } from "../components/ErrorBanner.jsx";
import { Pagination } from "../components/Pagination.jsx";
import { ProductGrid } from "../components/ProductGrid.jsx";
import { SearchFilters } from "../components/SearchFilters.jsx";

export function CatalogPage({
  filters,
  availableBrands,
  onFilterChange,
  productsState,
  currentPage,
  onPreviousPage,
  onNextPage,
  onViewDetail
}) {
  const hasProducts = productsState.data.length > 0;
  const meta = productsState.meta;

  return (
    <main className="page-grid">
      <SearchFilters filters={filters} availableBrands={availableBrands} onChange={onFilterChange} />
      <section className="surface">
        <div className="section-header">
          <div>
            <h2>Product results</h2>
            <p className="muted">
              {meta
                ? `${meta.total} matching product${meta.total === 1 ? "" : "s"}`
                : "Search by keyword, brand, price, or rating."}
            </p>
          </div>
        </div>

        <ErrorBanner message={productsState.error} />

        {productsState.loading ? <p className="status-text">Loading products...</p> : null}

        {!productsState.loading && hasProducts ? (
          <>
            <ProductGrid products={productsState.data} onViewDetail={onViewDetail} />
            {meta ? (
              <Pagination
                page={currentPage}
                totalPages={meta.totalPages}
                onPrevious={onPreviousPage}
                onNext={onNextPage}
              />
            ) : null}
          </>
        ) : null}

        {!productsState.loading && !hasProducts ? (
          <EmptyState
            title="No products matched the current filters."
            description="Try a broader keyword or remove one of the price or rating constraints."
          />
        ) : null}
      </section>
    </main>
  );
}
