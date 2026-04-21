import { ProductCard } from "./ProductCard.jsx";

export function ProductGrid({ products, onViewDetail }) {
  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onViewDetail={() => onViewDetail(product)} />
      ))}
    </div>
  );
}
