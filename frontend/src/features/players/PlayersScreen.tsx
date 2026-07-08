"use client";

import { usePlayers } from './usePlayers';
import { PlayerList } from './PlayerList';

interface PlayersScreenProps {
  categoryId: string;
}

export function PlayersScreen({ categoryId }: PlayersScreenProps) {
  const { players, loading, error } = usePlayers(categoryId);

  if (loading) return <p className="p-6 text-slate-500">Cargando jugadores...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (players.length === 0) return <p className="p-6 text-slate-500">No hay jugadores registrados.</p>;

  return (
    <section className="space-y-4 p-4">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Jugadores</p>
        <h1 className="text-2xl font-semibold text-slate-900">Plantilla por categoría</h1>
      </header>
      <PlayerList players={players} />
    </section>
  );
}
