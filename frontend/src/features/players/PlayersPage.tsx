"use client";

import { useState } from 'react';
import { useCategories } from '../categories/useCategories';
import { CategorySelector } from '../categories/CategorySelector';
import { PlayersScreen } from './PlayersScreen';

export function PlayersPage() {
  const { categories, loading, error } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  if (loading) return <p className="p-6 text-slate-500">Cargando categorías...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  const categoryId = selectedCategoryId || categories[0]?.id || '';

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <CategorySelector categories={categories} selectedCategoryId={categoryId} onSelect={setSelectedCategoryId} />
      </div>
      <PlayersScreen categoryId={categoryId} />
    </div>
  );
}
