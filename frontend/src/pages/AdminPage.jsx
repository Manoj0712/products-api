import { AdminPanel } from "../components/AdminPanel.jsx";

export function AdminPage({
  productsState,
  notice,
  currentPage,
  onPreviousPage,
  onNextPage,
  onSubmit,
  onDelete
}) {
  return (
    <main className="page-grid page-grid--admin">
      <AdminPanel
        products={productsState.data}
        loading={productsState.loading}
        error={productsState.error}
        notice={notice}
        meta={productsState.meta}
        currentPage={currentPage}
        onPreviousPage={onPreviousPage}
        onNextPage={onNextPage}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    </main>
  );
}
