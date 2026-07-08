import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { CategoryDTO } from '@shared/index';

export function useCategories() {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const createCategory = async (payload: { name: string; color: string }): Promise<CategoryDTO> => {
    try {
      const newCategory = await apiClient.createCategory(payload);
      setCategories([...categories, newCategory]);
      return newCategory;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al crear categoría');
    }
  };

  const updateCategory = async (categoryId: string, payload: { name: string; color: string }): Promise<CategoryDTO> => {
    try {
      const updated = await apiClient.updateCategory(categoryId, payload);
      setCategories(categories.map((c) => (c.id === categoryId ? updated : c)));
      return updated;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al actualizar categoría');
    }
  };

  const deleteCategory = async (categoryId: string): Promise<void> => {
    try {
      await apiClient.deleteCategory(categoryId);
      setCategories(categories.filter((c) => c.id !== categoryId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Error al eliminar categoría');
    }
  };

  return { categories, loading, error, createCategory, updateCategory, deleteCategory, loadCategories };
}
