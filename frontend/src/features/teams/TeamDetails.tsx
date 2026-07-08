"use client";

import { useTeam } from './useTeam';
import Link from 'next/link';
import { PlayerList } from '../players/PlayerList';

interface TeamDetailsProps {
  teamId: string;
}

export function TeamDetails({ teamId }: TeamDetailsProps) {
  const { team, players, loading, error } = useTeam(teamId);

  if (loading) return <p className="p-6 text-slate-500">Cargando equipo...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!team) return <p className="p-6 text-slate-500">Equipo no encontrado.</p>;

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <header className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 overflow-hidden rounded-full bg-slate-100">
            {team.crestUrl ? <img src={team.crestUrl} alt={team.name} className="h-full w-full object-cover" /> : null}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Equipo</p>
            <h1 className="text-3xl font-semibold text-slate-900">{team.name}</h1>
          </div>
        </div>
        <div className="text-right">
          <Link href="/" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
            Volver al inicio
          </Link>
        </div>
      </header>

      <section className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Categoría</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{team.categoryId}</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Jugadores</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">{players.length}</p>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Plantilla</p>
        <PlayerList players={players} />
      </section>
    </div>
  );
}
