"use client";

import type { CategoryDTO } from '@shared/index';

interface CategoriesTableProps {
  categories: CategoryDTO[];
  onEdit: (category: CategoryDTO) => void;
  onDelete: (categoryId: string, categoryName: string) => void;
}

export function CategoriesTable({ categories, onEdit, onDelete }: CategoriesTableProps) {
  return (
    <div className="rounded-lg bg-white shadow-sm overflow-x-auto">
      <table className="w-full text-left text-sm text-slate-700">
        <thead className="border-b border-slate-200 bg-slate-50">
          <tr>
            <th className="px-6 py-3 font-semibold">Nombre</th>
            <th className="px-6 py-3 font-semibold">Color</th>
            <th className="px-6 py-3 font-semibold">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.length === 0 ? (
            <tr>
              <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                No hay categorías aún
              </td>
            </tr>
          ) : (
            categories.map((category) => (
              <tr key={category.id} className="border-b border-slate-200 hover:bg-slate-50">
                <td className="px-6 py-4 font-medium">{category.name}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 rounded-full border border-slate-300"
                      style={{ backgroundColor: category.color }}
                      title={category.color}
                    />
                    <span className="text-xs text-slate-500">{category.color}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition">
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(category.id, category.name)}
                      className="rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
