"use client";

import Link from 'next/link';
import Image from 'next/image';
import { memo, useMemo } from 'react';
import type { PlayerDTO } from '@shared/index';

interface PlayerListProps {
  players: PlayerDTO[];
}

interface PlayerCardProps {
  player: PlayerDTO;
}

// Memoize player card to prevent unnecessary re-renders
const PlayerCard = memo(function PlayerCard({ player }: PlayerCardProps) {
  const formattedPoints = useMemo(
    () => player.seasonPoints.toFixed(1),
    [player.seasonPoints]
  );

  return (
    <Link href={`/players/${player.id}`} className="block rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-green-500 hover:bg-slate-50">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-full bg-slate-100">
          {player.cardPhotoUrl ? (
            <Image
              src={player.cardPhotoUrl}
              alt={player.name}
              fill
              className="object-cover"
              sizes="64px"
              loading="lazy"
            />
          ) : null}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">{player.name}</p>
          <p className="text-sm text-slate-500">#{player.jerseyNumber ?? '-'}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <p>Posición: {player.position}</p>
        <p>Puntos: {formattedPoints}</p>
        <p>Goles: {player.goals}</p>
      </div>
    </Link>
  );
});

export const PlayerList = memo(function PlayerList({ players }: PlayerListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </div>
  );
});
