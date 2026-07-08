"use client";

import { useTeams } from './useTeams';
import { TeamList } from './TeamList';

interface TeamsScreenProps {
  categoryId: string;
}

export function TeamsScreen({ categoryId }: TeamsScreenProps) {
  const { teams, loading, error } = useTeams(categoryId);

  if (loading) return <p className="p-6 text-slate-500">Cargando equipos...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (teams.length === 0) return <p className="p-6 text-slate-500">No hay equipos en esta categoría.</p>;

  return (
    <section className="space-y-4 p-4">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Equipos</p>
        <h1 className="text-2xl font-semibold text-slate-900">Plantel de la categoría</h1>
      </header>
      <TeamList teams={teams} />
    </section>
  );
}
