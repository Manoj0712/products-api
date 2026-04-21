import { useEffect, useState } from "react";
import { fetchProductById } from "../api/products.js";

const initialDetailState = {
  product: null,
  loading: false,
  error: ""
};

export function useProductDetail(productId, enabled) {
  const [detailState, setDetailState] = useState(initialDetailState);

  useEffect(() => {
    if (!enabled || !productId) {
      return;
    }

    let active = true;
    setDetailState({
      product: null,
      loading: true,
      error: ""
    });

    fetchProductById(productId)
      .then((product) => {
        if (!active) {
          return;
        }

        setDetailState({
          product,
          loading: false,
          error: ""
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setDetailState({
          product: null,
          loading: false,
          error: error.message
        });
      });

    return () => {
      active = false;
    };
  }, [enabled, productId]);

  return detailState;
}
