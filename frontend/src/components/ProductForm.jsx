import { useState } from "react";
import { Field } from "./Field.jsx";

function formatImages(images = []) {
  return images.join("\n");
}

function formatSpecifications(specifications = {}) {
  return Object.entries(specifications)
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function formatReviews(reviews = []) {
  return reviews.map((review) => `${review.user || ""}|${review.rating || ""}|${review.comment || ""}`).join("\n");
}

function parseImages(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSpecifications(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((specifications, line) => {
      const [rawKey, ...rawValue] = line.split(":");
      if (!rawKey || rawValue.length === 0) {
        return specifications;
      }

      specifications[rawKey.trim()] = rawValue.join(":").trim();
      return specifications;
    }, {});
}

function parseReviews(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [user, rating, comment] = line.split("|");
      return {
        user: (user || "").trim(),
        rating: Number(rating || 0),
        comment: (comment || "").trim()
      };
    })
    .filter((review) => review.comment || review.user || review.rating);
}

function getInitialValues(product) {
  return {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    rating: product?.rating || "",
    currency: product?.currency || "USD",
    sku: product?.sku || "",
    brand: product?.brand || "",
    category: product?.category || "",
    availability: product?.availability || "In Stock",
    images: formatImages(product?.images),
    specifications: formatSpecifications(product?.specifications),
    reviews: formatReviews(product?.reviews)
  };
}

export function ProductForm({ product, submitting, onSubmit, onCancel }) {
  const [values, setValues] = useState(() => getInitialValues(product));
  const [formError, setFormError] = useState("");

  function updateValue(key, value) {
    setValues((current) => ({
      ...current,
      [key]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");

    if (!values.name.trim() || !values.description.trim() || !String(values.price).trim() || !String(values.rating).trim() || !values.sku.trim()) {
      setFormError("Name, description, price, rating, and SKU are required.");
      return;
    }

    try {
      await onSubmit({
        name: values.name.trim(),
        description: values.description.trim(),
        price: Number(values.price),
        rating: Number(values.rating),
        currency: values.currency.trim() || "USD",
        sku: values.sku.trim(),
        brand: values.brand.trim(),
        category: values.category.trim(),
        availability: values.availability.trim() || "In Stock",
        images: parseImages(values.images),
        specifications: parseSpecifications(values.specifications),
        reviews: parseReviews(values.reviews)
      });
    } catch (error) {
      setFormError(error.message || "Unable to save product.");
    }
  }

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      {formError ? <p className="error-banner">{formError}</p> : null}
      <div className="form-grid">
        <Field label="Product name">
          <input value={values.name} onChange={(event) => updateValue("name", event.target.value)} />
        </Field>
        <Field label="SKU">
          <input value={values.sku} onChange={(event) => updateValue("sku", event.target.value)} />
        </Field>
        <Field label="Price">
          <input
            type="number"
            min="0"
            step="0.01"
            value={values.price}
            onChange={(event) => updateValue("price", event.target.value)}
          />
        </Field>
        <Field label="Rating">
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={values.rating}
            onChange={(event) => updateValue("rating", event.target.value)}
          />
        </Field>
        <Field label="Currency">
          <input value={values.currency} onChange={(event) => updateValue("currency", event.target.value)} />
        </Field>
        <Field label="Brand">
          <input value={values.brand} onChange={(event) => updateValue("brand", event.target.value)} />
        </Field>
        <Field label="Category">
          <input value={values.category} onChange={(event) => updateValue("category", event.target.value)} />
        </Field>
        <Field label="Availability">
          <input value={values.availability} onChange={(event) => updateValue("availability", event.target.value)} />
        </Field>
      </div>

      <Field label="Description">
        <textarea rows="4" value={values.description} onChange={(event) => updateValue("description", event.target.value)} />
      </Field>

      <div className="form-grid">
        <Field label="Images" hint="One image URL per line.">
          <textarea rows="5" value={values.images} onChange={(event) => updateValue("images", event.target.value)} />
        </Field>
        <Field label="Specifications" hint="One pair per line using key: value.">
          <textarea
            rows="5"
            value={values.specifications}
            onChange={(event) => updateValue("specifications", event.target.value)}
          />
        </Field>
      </div>

      <Field label="Reviews" hint="One review per line using user|rating|comment.">
        <textarea rows="5" value={values.reviews} onChange={(event) => updateValue("reviews", event.target.value)} />
      </Field>

      <div className="form-actions">
        <button className="button button--primary" disabled={submitting} type="submit">
          {submitting ? "Saving..." : product ? "Update product" : "Create product"}
        </button>
        {onCancel ? (
          <button className="button button--ghost" type="button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>
    </form>
  );
}
