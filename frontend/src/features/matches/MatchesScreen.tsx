"use client";

import { MatchList } from './MatchList';
import { useMatches } from './useMatches';

interface MatchesScreenProps {
  categoryId: string;
}

export function MatchesScreen({ categoryId }: MatchesScreenProps) {
  const { matches, loading, error } = useMatches(categoryId);

  if (loading) return <p className="p-6 text-slate-500">Cargando partidos...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (matches.length === 0) return <p className="p-6 text-slate-500">No hay partidos para esta categoría.</p>;

  return (
    <section className="space-y-4 p-4">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Partidos</p>
        <h1 className="text-2xl font-semibold text-slate-900">Calendario de la categoría</h1>
      </header>
      <MatchList matches={matches} />
    </section>
  );
}
