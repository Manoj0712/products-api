import { formatCurrency, formatRating } from "../utils/formatters.js";

export function ProductDetail({ product }) {
  return (
    <article className="detail-layout">
      <div className="detail-gallery">
        {(product.images?.length ? product.images : ["https://via.placeholder.com/640x480?text=Product"]).map((image) => (
          <img key={image} src={image} alt={product.name} />
        ))}
      </div>
      <div className="detail-content">
        <p className="eyebrow">{product.brand || "Catalog item"}</p>
        <h2>{product.name}</h2>
        <p className="detail-price">{formatCurrency(product.price, product.currency)}</p>
        <p className="muted">{product.description}</p>
        <div className="detail-tags">
          <span className="product-chip">{product.availability}</span>
          <span className="product-chip">SKU: {product.sku}</span>
          <span className="product-chip">{formatRating(product.rating, product.reviews)}</span>
        </div>

        <section className="detail-section">
          <h3>Specifications</h3>
          {Object.keys(product.specifications || {}).length === 0 ? (
            <p className="muted">No specifications provided.</p>
          ) : (
            <dl className="spec-grid">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <section className="detail-section">
          <h3>Reviews</h3>
          {product.reviews?.length ? (
            <div className="review-list">
              {product.reviews.map((review, index) => (
                <article className="review-card" key={`${review.user}-${index}`}>
                  <div className="review-card__header">
                    <strong>{review.user || "Anonymous"}</strong>
                    <span>{review.rating}/5</span>
                  </div>
                  <p className="muted">{review.comment}</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="muted">No reviews yet.</p>
          )}
        </section>
      </div>
    </article>
  );
}
