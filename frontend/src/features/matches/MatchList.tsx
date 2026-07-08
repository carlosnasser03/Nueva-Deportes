import Link from 'next/link';
import { memo, useMemo } from 'react';
import type { MatchDTO } from '@shared/index';

interface MatchListProps {
  matches: MatchDTO[];
}

interface MatchItemProps {
  match: MatchDTO;
}

// Memoize match item to prevent unnecessary re-renders
const MatchItem = memo(function MatchItem({ match }: MatchItemProps) {
  const formattedDate = useMemo(
    () => new Date(match.date).toLocaleDateString('es-ES'),
    [match.date]
  );

  return (
    <Link href={`/matches/${match.id}`} className="block rounded-3xl border border-slate-200 p-4 transition hover:border-green-500 hover:bg-slate-50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{formattedDate}</p>
          <h2 className="text-lg font-semibold text-slate-900">{match.home.name} vs {match.away.name}</h2>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
          {match.status}
        </span>
      </div>
      <p className="mt-3 text-sm text-slate-600">Lugar: {match.venue}</p>
      <p className="mt-2 text-sm text-slate-700">Marcador: {match.homeGoals ?? '-'} · {match.awayGoals ?? '-'}</p>
    </Link>
  );
});

export const MatchList = memo(function MatchList({ matches }: MatchListProps) {
  return (
    <div className="space-y-4 rounded-3xl bg-white p-4 shadow-sm">
      {matches.map((match) => (
        <MatchItem key={match.id} match={match} />
      ))}
    </div>
  );
});
