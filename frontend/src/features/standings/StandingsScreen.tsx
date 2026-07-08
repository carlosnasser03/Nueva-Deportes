"use client";

import { StandingsTable } from '@components/ui/StandingsTable';
import { useStandings } from './useStandings';

interface StandingsScreenProps {
  categoryId: string;
}

export function StandingsScreen({ categoryId }: StandingsScreenProps) {
  const { standings, loading, error } = useStandings(categoryId);

  if (loading) {
    return <p className="p-6 text-slate-500">Cargando tabla...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-600">Error: {error}</p>;
  }

  return (
    <section className="space-y-4 p-4">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Tabla de posiciones</p>
        <h1 className="text-2xl font-semibold text-slate-900">Categoría {categoryId}</h1>
      </header>
      <StandingsTable rows={standings} />
    </section>
  );
}
