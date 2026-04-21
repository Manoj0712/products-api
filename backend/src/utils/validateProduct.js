export function validateProductInput(payload) {
  const requiredFields = ["name", "description", "price", "sku", "rating"];

  for (const field of requiredFields) {
    if (
      payload[field] === undefined ||
      payload[field] === null ||
      String(payload[field]).trim() === ""
    ) {
      const error = new Error(`${field} is required`);
      error.status = 400;
      throw error;
    }
  }

  if (Number.isNaN(Number(payload.price))) {
    const error = new Error("price must be a valid number");
    error.status = 400;
    throw error;
  }

  if (Number.isNaN(Number(payload.rating)) || Number(payload.rating) < 0 || Number(payload.rating) > 5) {
    const error = new Error("rating must be a valid number between 0 and 5");
    error.status = 400;
    throw error;
  }
}
