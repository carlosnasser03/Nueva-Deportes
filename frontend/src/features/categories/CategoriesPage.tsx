"use client";

import { useState } from 'react';
import type { CategoryDTO } from '@shared/index';
import { useCategories } from './useCategories';
import { CategoriesTable } from './CategoriesTable';
import { CategoryForm } from './CategoryForm';

export function CategoriesPage() {
  const { categories, loading, error, createCategory, updateCategory, deleteCategory } = useCategories();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDTO | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const handleOpenModal = () => {
    setEditingCategory(null);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleEdit = (category: CategoryDTO) => {
    setEditingCategory(category);
    setSubmitError(null);
    setIsModalOpen(true);
  };

  const handleDeleteRequest = (categoryId: string, categoryName: string) => {
    setDeleteConfirm({ id: categoryId, name: categoryName });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm) return;
    try {
      setIsSubmitting(true);
      await deleteCategory(deleteConfirm.id);
      setDeleteConfirm(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al eliminar categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForm = async (data: { name: string; color: string }) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }

      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Error al guardar categoría');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setSubmitError(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Categorías</h1>
          <p className="text-slate-600 mt-1">Gestiona las categorías de tu liga</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="rounded-lg bg-green-600 px-6 py-2 text-white font-medium hover:bg-green-700 transition">
          + Nueva Categoría
        </button>
      </div>

      {/* Error message */}
      {error && <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">{error}</div>}

      {/* Loading state */}
      {loading ? (
        <div className="rounded-lg bg-white p-8 text-center text-slate-500">
          Cargando categorías...
        </div>
      ) : (
        /* Table */
        <CategoriesTable categories={categories} onEdit={handleEdit} onDelete={handleDeleteRequest} />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-xl font-bold text-slate-900 mb-4">
              {editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}
            </h2>

            {submitError && (
              <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                {submitError}
              </div>
            )}

            <CategoryForm
              initialData={editingCategory || undefined}
              onSubmit={handleSubmitForm}
              onCancel={handleCloseModal}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
            <h2 className="text-lg font-bold text-slate-900 mb-2">Confirmar eliminación</h2>
            <p className="text-slate-600 mb-6">
              ¿Estás seguro de que deseas eliminar la categoría "{deleteConfirm.name}"? Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                disabled={isSubmitting}>
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 transition disabled:bg-slate-400"
                disabled={isSubmitting}>
                {isSubmitting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
