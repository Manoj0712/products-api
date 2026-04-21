export function AppHeader({ routeName, onCatalogClick, onAdminClick }) {
  return (
    <header className="hero-panel">
      <div>
        <p className="eyebrow">SuperLabs Product Listing</p>
        <h1>Frontend for catalog search, detail view, and admin product management.</h1>
        <p className="hero-panel__text">
          Built from the assignment document as a clean Vite React app with reusable components and
          direct integration with your backend routes.
        </p>
      </div>
      <nav className="topbar">
        <button
          className={`button ${routeName === "catalog" ? "button--primary" : "button--ghost"}`}
          onClick={onCatalogClick}
        >
          Catalog
        </button>
        <button
          className={`button ${routeName === "admin" ? "button--primary" : "button--ghost"}`}
          onClick={onAdminClick}
        >
          Admin
        </button>
      </nav>
    </header>
  );
}
