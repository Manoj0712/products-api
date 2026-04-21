import { useState } from "react";
import { ErrorBanner } from "./ErrorBanner.jsx";
import { Pagination } from "./Pagination.jsx";
import { ProductForm } from "./ProductForm.jsx";
import { formatCurrency, formatRating } from "../utils/formatters.js";

export function AdminPanel({
  products,
  loading,
  error,
  notice,
  meta,
  currentPage,
  onPreviousPage,
  onNextPage,
  onSubmit,
  onDelete
}) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const sortedProducts = [...products].sort((left, right) => left.name.localeCompare(right.name));

  async function handleSubmit(values) {
    setSubmitting(true);

    try {
      await onSubmit(values, editingProduct?.id);
      setEditingProduct(null);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(productId) {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    await onDelete(productId);
    if (editingProduct?.id === productId) {
      setEditingProduct(null);
    }
  }

  return (
    <>
      <section className="surface">
        <div className="section-header">
          <div>
            <h2>{editingProduct ? "Edit product" : "Create product"}</h2>
            <p className="muted">
              Manage the backend task’s admin flow with a readable form and reusable parsing helpers.
            </p>
          </div>
        </div>
        {notice ? <p className="notice">{notice}</p> : null}
        <ErrorBanner message={error} />
        <ProductForm
          key={editingProduct?.id || "create"}
          product={editingProduct}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={editingProduct ? () => setEditingProduct(null) : null}
        />
      </section>

      <section className="surface">
        <div className="section-header">
          <div>
            <h2>Product inventory</h2>
            <p className="muted">Edit or delete the products currently available through the API.</p>
          </div>
        </div>
        <ErrorBanner message={error} />
        {loading ? <p className="status-text">Loading admin products...</p> : null}
        {!loading && sortedProducts.length === 0 ? <p className="status-text">No products found.</p> : null}
        {!loading && sortedProducts.length > 0 ? (
          <div className="admin-list">
            {sortedProducts.map((product) => (
              <article className="admin-row" key={product.id}>
                <div>
                  <h3>{product.name}</h3>
                  <p className="muted">
                    {product.brand || "Unbranded"} · {product.category || "General"} · {formatCurrency(product.price, product.currency)} · {formatRating(product.rating, product.reviews)}
                  </p>
                </div>
                <div className="admin-row__actions">
                  <button className="button button--ghost" onClick={() => setEditingProduct(product)}>
                    Edit
                  </button>
                  <button className="button button--danger" onClick={() => handleDelete(product.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : null}
        {!loading && meta ? (
          <Pagination
            page={currentPage}
            totalPages={meta.totalPages}
            onPrevious={onPreviousPage}
            onNext={onNextPage}
          />
        ) : null}
      </section>
    </>
  );
}
