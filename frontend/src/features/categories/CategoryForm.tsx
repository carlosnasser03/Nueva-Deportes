"use client";

import { useState } from 'react';
import type { CategoryDTO } from '@shared/index';

interface CategoryFormProps {
  initialData?: CategoryDTO;
  onSubmit: (data: { name: string; color: string }) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PRESET_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#6366F1', '#14B8A6'];

export function CategoryForm({ initialData, onSubmit, onCancel, isLoading = false }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    color: initialData?.color || '#10B981',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('El nombre es requerido');
      return;
    }
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error en formulario:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
          Nombre de la categoría
        </label>
        <input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="ej: Sub-8, Sub-10, etc"
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-500 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="color" className="block text-sm font-medium text-slate-700 mb-2">
          Color de la categoría
        </label>

        {/* Color presets */}
        <div className="mb-3 flex flex-wrap gap-2">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setFormData({ ...formData, color })}
              className={`h-8 w-8 rounded-full border-2 transition ${
                formData.color === color ? 'border-slate-900' : 'border-slate-300'
              }`}
              style={{ backgroundColor: color }}
              title={color}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Custom color input */}
        <div className="flex gap-2">
          <input
            id="color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="h-10 w-20 cursor-pointer rounded-lg border border-slate-300"
            disabled={isLoading}
          />
          <input
            type="text"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            placeholder="#10B981"
            className="flex-1 rounded-lg border border-slate-300 px-4 py-2 text-slate-900 placeholder-slate-500 font-mono text-sm focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500"
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
          disabled={isLoading}>
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition disabled:bg-slate-400"
          disabled={isLoading}>
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
