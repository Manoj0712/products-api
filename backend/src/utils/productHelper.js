export const buildProduct = (input, existingId) => {
  const reviews = Array.isArray(input.reviews) ? input.reviews : [];
  const id = `prod-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  return {
    id: existingId || id,
    slug: input.slug ? slugify(input.slug) : slugify(input.name),
    name: input.name,
    description: input.description,
    price: Number(input.price),
    rating: getProductRating({
      rating: input.rating,
      reviews
    }),
    currency: input.currency || "USD",
    sku: input.sku,
    images: Array.isArray(input.images) ? input.images : [],
    availability: input.availability || "In Stock",
    category: input.category || "",
    brand: input.brand || "",
    specifications: input.specifications || {},
    reviews
  };  
}

export function toArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}


export function getAverageRating(reviews = []) {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0);
  return total / reviews.length;
}

export function getProductRating(product) {
  if (product.rating !== undefined && product.rating !== null && product.rating !== "") {
    return Number(product.rating);
  }

  return getAverageRating(product.reviews);
}

export function normalizeRecord(record) {
  if (!record) {
    return null;
  }

  return {
    ...record,
    price: Number(record.price),
    rating: Number(record.rating ?? getAverageRating(record.reviews))
  };
}