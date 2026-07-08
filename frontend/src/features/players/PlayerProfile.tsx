"use client";

import { usePlayerProfile } from './usePlayerProfile';
import type { PlayerProfileDTO } from '@shared/index';
import Link from 'next/link';

interface PlayerProfileProps {
  playerId: string;
}

export function PlayerProfile({ playerId }: PlayerProfileProps) {
  const { player, loading, error } = usePlayerProfile(playerId);

  if (loading) return <p className="p-6 text-slate-500">Cargando perfil del jugador...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!player) return <p className="p-6 text-slate-500">Jugador no encontrado.</p>;

  return (
    <article className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <header className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="flex items-center gap-4">
          <div className="h-24 w-24 overflow-hidden rounded-full bg-slate-100">
            {player.cardPhotoUrl ? <img src={player.cardPhotoUrl} alt={player.name} className="h-full w-full object-cover" /> : null}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Jugador</p>
            <h1 className="text-3xl font-semibold text-slate-900">{player.name}</h1>
            <p className="text-sm text-slate-500">#{player.jerseyNumber ?? '-'}</p>
          </div>
        </div>
        <div className="text-right">
          <Link href="/" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
            Volver al inicio
          </Link>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Posición</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{player.position}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Goles</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{player.goals}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Puntos</p>
          <p className="mt-2 text-xl font-semibold text-slate-900">{player.seasonPoints.toFixed(1)}</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Historial</p>
        <div className="mt-4 grid gap-3">
          {player.history.map((item) => (
            <div key={item.matchId} className="rounded-3xl bg-slate-50 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{item.opponent}</p>
                  <p className="text-sm text-slate-500">{new Date(item.date).toLocaleDateString('es-ES')}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-900">Goles: {item.goals}</p>
                  <p className="text-sm text-slate-600">Pts: {item.points}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}
