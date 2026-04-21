import { formatCurrency, formatRating } from "../utils/formatters.js";

export function ProductCard({ product, onViewDetail }) {
  const primaryImage = product.images?.[0] || "https://via.placeholder.com/480x360?text=Product";

  return (
    <article className="product-card">
      <img className="product-card__image" src={primaryImage} alt={product.name} />
      <div className="product-card__body">
        <p className="product-card__meta">{product.brand || "General"} · {product.category || "Catalog"}</p>
        <h3>{product.name}</h3>
        <p className="product-card__price">{formatCurrency(product.price, product.currency)}</p>
        <p className="muted">{product.description}</p>
      </div>
      <div className="product-card__footer">
        <span className="product-chip">{product.availability}</span>
        <span className="product-chip">{formatRating(product.rating, product.reviews)}</span>
      </div>
      <button className="button button--primary product-card__button" onClick={onViewDetail}>
        View details
      </button>
    </article>
  );
}
