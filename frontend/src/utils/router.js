export function parseRoute(pathname) {
  if (pathname.startsWith("/admin")) {
    return { name: "admin" };
  }

  const detailMatch = pathname.match(/^\/products\/([^/]+)$/);
  if (detailMatch) {
    return {
      name: "detail",
      productId: decodeURIComponent(detailMatch[1])
    };
  }

  return { name: "catalog" };
}

export function navigate(path) {
  window.history.pushState({}, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
