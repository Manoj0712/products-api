import { AppHeader } from "./components/AppHeader.jsx";
import { useProductDetail } from "./hooks/useProductDetail.js";
import { useProducts } from "./hooks/useProducts.js";
import { useRoute } from "./hooks/useRoute.js";
import { AdminPage } from "./pages/AdminPage.jsx";
import { CatalogPage } from "./pages/CatalogPage.jsx";
import { ProductDetailPage } from "./pages/ProductDetailPage.jsx";
import "./App.css";
import { navigate } from "./utils/router.js";

export default function App() {
  const route = useRoute();
  const products = useProducts(route.name === "catalog" || route.name === "admin");
  const detailState = useProductDetail(route.productId, route.name === "detail");

  function openProductDetail(product) {
    navigate(`/products/${product.id}`);
  }

  return (
    <div className="app-shell">
      <AppHeader
        routeName={route.name}
        onCatalogClick={() => navigate("/")}
        onAdminClick={() => navigate("/admin")}
      />

      {route.name === "catalog" ? (
        <CatalogPage
          filters={products.filters}
          availableBrands={products.productsState.meta?.availableBrands || []}
          onFilterChange={products.updateFilters}
          productsState={products.productsState}
          currentPage={products.currentPage}
          onPreviousPage={() => products.setCurrentPage((page) => Math.max(1, page - 1))}
          onNextPage={() =>
            products.setCurrentPage((page) =>
              Math.min(products.productsState.meta?.totalPages || page, page + 1)
            )
          }
          onViewDetail={openProductDetail}
        />
      ) : null}

      {route.name === "detail" ? (
        <ProductDetailPage detailState={detailState} onBack={() => navigate("/")} />
      ) : null}

      {route.name === "admin" ? (
        <AdminPage
          productsState={products.productsState}
          notice={products.adminNotice}
          currentPage={products.currentPage}
          onPreviousPage={() => products.setCurrentPage((page) => Math.max(1, page - 1))}
          onNextPage={() =>
            products.setCurrentPage((page) =>
              Math.min(products.productsState.meta?.totalPages || page, page + 1)
            )
          }
          onSubmit={products.submitProduct}
          onDelete={products.removeProduct}
        />
      ) : null}
    </div>
  );
}
