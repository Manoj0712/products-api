import { Field } from "./Field.jsx";

export function SearchFilters({ filters, availableBrands, onChange }) {
  function updateValue(key, value) {
    onChange({
      ...filters,
      [key]: value
    });
  }

  function toggleBrand(brand) {
    const nextBrands = filters.brands.includes(brand)
      ? filters.brands.filter((item) => item !== brand)
      : [...filters.brands, brand];

    updateValue("brands", nextBrands);
  }

  function handleReset() {
    onChange({
      q: "",
      minPrice: "",
      maxPrice: "",
      minRating: "",
      brands: []
    });
  }

  return (
    <aside className="surface filter-panel">
      <div className="section-header">
        <div>
          <h2>Search filters</h2>
          <p className="muted">Use the backend search API with pagination and filtering.</p>
        </div>
      </div>

      <div className="filter-stack">
        <Field label="Keyword">
          <input value={filters.q} onChange={(event) => updateValue("q", event.target.value)} placeholder="headphones, monitor..." />
        </Field>
        <Field label="Brand">
          <div className="checkbox-list">
            {availableBrands.length > 0 ? (
              availableBrands.map((brand) => (
                <label className="checkbox-item" key={brand}>
                  <input
                    type="checkbox"
                    checked={filters.brands.includes(brand)}
                    onChange={() => toggleBrand(brand)}
                  />
                  <span>{brand}</span>
                </label>
              ))
            ) : (
              <p className="muted">No brands available.</p>
            )}
          </div>
        </Field>
        <Field label="Minimum rating">
          <input
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={(event) => updateValue("minRating", event.target.value)}
          />
        </Field>
        <Field label="Minimum price">
          <input type="number" min="0" value={filters.minPrice} onChange={(event) => updateValue("minPrice", event.target.value)} />
        </Field>
        <Field label="Maximum price">
          <input type="number" min="0" value={filters.maxPrice} onChange={(event) => updateValue("maxPrice", event.target.value)} />
        </Field>
      </div>

      <button className="button button--ghost" onClick={handleReset} type="button">
        Reset filters
      </button>
    </aside>
  );
}
