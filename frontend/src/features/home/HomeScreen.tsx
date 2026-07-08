"use client";

import { useState } from 'react';
import { useCategories } from '../categories/useCategories';
import { CategorySelector } from '../categories/CategorySelector';
import { StandingsScreen } from '../standings/StandingsScreen';
import { MatchesScreen } from '../matches/MatchesScreen';
import { PlayersScreen } from '../players/PlayersScreen';
import { ScorersScreen } from '../scorers/ScorersScreen';
import { TeamsScreen } from '../teams/TeamsScreen';
import { SponsorsScreen } from '../sponsors/SponsorsScreen';

export function HomeScreen() {
  const { categories, loading, error } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  if (loading) return <p className="p-6 text-slate-500">Cargando categorías...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  const categoryId = selectedCategoryId || categories[0]?.id || '';

  return (
    <div>
      <header className="rounded-3xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold text-slate-900">DeporteHN</h1>
        <p className="mt-2 text-slate-600">Resultados, tabla y partidos por categoría</p>
      </header>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-sm">
        <CategorySelector
          categories={categories}
          selectedCategoryId={categoryId}
          onSelect={setSelectedCategoryId}
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <StandingsScreen categoryId={categoryId} />
        <ScorersScreen categoryId={categoryId} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <TeamsScreen categoryId={categoryId} />
        <SponsorsScreen categoryId={categoryId} />
      </div>

      <div className="mt-6">
        <MatchesScreen categoryId={categoryId} />
      </div>

      <div className="mt-6">
        <PlayersScreen categoryId={categoryId} />
      </div>
    </div>
  );
}
