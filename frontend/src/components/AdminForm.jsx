import { useEffect, useState } from "react";

const initialState = {
  name: "",
  slug: "",
  description: "",
  price: "",
  currency: "USD",
  sku: "",
  images: "",
  availability: "In Stock",
  category: "",
  brand: "",
  specifications: '{\n  "color": "Black"\n}',
  reviews: '[\n  {\n    "user": "Admin",\n    "rating": 5,\n    "comment": "New item"\n  }\n]'
};

export function AdminForm({ selectedProduct, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!selectedProduct) {
      setForm(initialState);
      return;
    }

    setForm({
      name: selectedProduct.name || "",
      slug: selectedProduct.slug || "",
      description: selectedProduct.description || "",
      price: selectedProduct.price || "",
      currency: selectedProduct.currency || "USD",
      sku: selectedProduct.sku || "",
      images: (selectedProduct.images || []).join(", "),
      availability: selectedProduct.availability || "In Stock",
      category: selectedProduct.category || "",
      brand: selectedProduct.brand || "",
      specifications: JSON.stringify(selectedProduct.specifications || {}, null, 2),
      reviews: JSON.stringify(selectedProduct.reviews || [], null, 2)
    });
  }, [selectedProduct]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    try {
      setError("");
      const payload = {
        ...form,
        price: Number(form.price),
        images: form.images
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        specifications: JSON.parse(form.specifications || "{}"),
        reviews: JSON.parse(form.reviews || "[]")
      };
      onSubmit(payload);
    } catch {
      setError("Specifications and reviews must be valid JSON.");
    }
  }

  return (
    <section className="panel admin-panel">
      <div className="panel-header">
        <h2>{selectedProduct ? "Edit product" : "Create product"}</h2>
        {selectedProduct ? <button onClick={onCancel}>Clear</button> : null}
      </div>
      <form className="admin-form" onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} />
        <input name="sku" placeholder="SKU" value={form.sku} onChange={handleChange} />
        <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
        <input name="brand" placeholder="Brand" value={form.brand} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <input
          name="availability"
          placeholder="Availability"
          value={form.availability}
          onChange={handleChange}
        />
        <input
          name="images"
          placeholder="Image URLs separated by commas"
          value={form.images}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          value={form.description}
          onChange={handleChange}
        />
        <textarea
          name="specifications"
          placeholder="Specifications JSON"
          rows="6"
          value={form.specifications}
          onChange={handleChange}
        />
        <textarea
          name="reviews"
          placeholder="Reviews JSON"
          rows="6"
          value={form.reviews}
          onChange={handleChange}
        />
        {error ? <p className="error-text">{error}</p> : null}
        <button type="submit" disabled={submitting}>
          {submitting ? "Saving..." : selectedProduct ? "Update product" : "Create product"}
        </button>
      </form>
    </section>
  );
}
