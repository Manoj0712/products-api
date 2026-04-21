import { useEffect, useState } from "react";
import { deleteProduct, fetchProducts, saveProduct } from "../api/products.js";
import { initialProductFilters } from "../constants/productFilters.js";

const initialProductsState = {
  data: [],
  meta: null,
  loading: true,
  error: ""
};

export function useProducts(enabled) {
  const [filters, setFilters] = useState(initialProductFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsState, setProductsState] = useState(initialProductsState);
  const [adminNotice, setAdminNotice] = useState("");

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let active = true;
    setProductsState((state) => ({
      ...state,
      loading: true,
      error: ""
    }));

    fetchProducts({
      ...filters,
      page: currentPage
    })
      .then((response) => {
        if (!active) {
          return;
        }
        setProductsState({
          data: response.data,
          meta: response.meta,
          loading: false,
          error: ""
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setProductsState({
          data: [],
          meta: null,
          loading: false,
          error: error.message
        });
      });

    return () => {
      active = false;
    };
  }, [enabled, filters, currentPage]);

  function updateFilters(nextFilters) {
    setCurrentPage(1);
    setFilters(nextFilters);
  }

  async function submitProduct(formValues, editingProductId) {
    const savedProduct = await saveProduct(formValues, editingProductId);
    setAdminNotice(editingProductId ? "Product updated." : "Product created.");

    setProductsState((state) => ({
      ...state,
      data: editingProductId
        ? state.data.map((product) => (product.id === savedProduct.id ? savedProduct : product))
        : [savedProduct, ...state.data]
    }));
  }

  async function removeProduct(productId) {
    await deleteProduct(productId);
    setAdminNotice("Product deleted.");

    setProductsState((state) => ({
      ...state,
      data: state.data.filter((product) => product.id !== productId)
    }));
  }

  return {
    filters,
    currentPage,
    productsState,
    adminNotice,
    setCurrentPage,
    updateFilters,
    submitProduct,
    removeProduct
  };
}
