export function formatCurrency(value, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency
  }).format(Number(value || 0));
}

export function formatRating(rating, reviews = []) {
  const numericRating = Number(rating);

  if (!Number.isNaN(numericRating) && numericRating > 0) {
    return `${numericRating.toFixed(1)}/5 rating`;
  }

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return "No reviews";
  }

  const average = reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length;
  return `${average.toFixed(1)}/5 rating`;
}
