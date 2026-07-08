"use client";

import Link from 'next/link';
import type { PlayerDTO } from '@shared/index';

interface PlayerListProps {
  players: PlayerDTO[];
}

export function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {players.map((player) => (
        <Link key={player.id} href={`/players/${player.id}`} className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-green-500 hover:bg-slate-50">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 overflow-hidden rounded-full bg-slate-100">
              {player.cardPhotoUrl ? <img src={player.cardPhotoUrl} alt={player.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{player.name}</p>
              <p className="text-sm text-slate-500">#{player.jerseyNumber ?? '-'}</p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <p>Posición: {player.position}</p>
            <p>Puntos: {player.seasonPoints.toFixed(1)}</p>
            <p>Goles: {player.goals}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
