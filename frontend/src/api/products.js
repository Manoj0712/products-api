const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = "Request failed";

    try {
      const data = await response.json();
      message = data.message || message;
    } catch {
      message = response.statusText || message;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function fetchProducts(params = {}) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value
        .filter((item) => String(item).trim() !== "")
        .forEach((item) => searchParams.append(key, item));
      return;
    }

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return request(`/api/products${query ? `?${query}` : ""}`);
}

export async function fetchProductById(productId) {
  return request(`/api/products/${encodeURIComponent(productId)}`);
}

export async function saveProduct(payload, productId) {
  const path = productId ?
    `/api/admin/products/${productId}`
    : "/api/admin/products/create";
  const method = productId ? "PUT" : "POST";

  return request(path, {
    method,
    body: JSON.stringify(payload)
  });
}

export async function deleteProduct(productId) {
  return request(`/api/admin/products/${productId}`, {
    method: "DELETE"
  });
}
