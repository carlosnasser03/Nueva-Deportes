"use client";

import { useScorers } from './useScorers';
import { ScorerList } from './ScorerList';

interface ScorersScreenProps {
  categoryId: string;
}

export function ScorersScreen({ categoryId }: ScorersScreenProps) {
  const { scorers, loading, error } = useScorers(categoryId);

  if (loading) return <p className="p-6 text-slate-500">Cargando goleadores...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (scorers.length === 0) return <p className="p-6 text-slate-500">No hay datos de goleadores aún.</p>;

  return (
    <section className="space-y-4 p-4">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Goleadores</p>
        <h1 className="text-2xl font-semibold text-slate-900">Máximos anotadores</h1>
      </header>
      <ScorerList scorers={scorers} />
    </section>
  );
}
