import Link from 'next/link';
import type { MatchDTO } from '@shared/index';

interface MatchListProps {
  matches: MatchDTO[];
}

export function MatchList({ matches }: MatchListProps) {
  return (
    <div className="space-y-4 rounded-3xl bg-white p-4 shadow-sm">
      {matches.map((match) => (
        <Link key={match.id} href={`/matches/${match.id}`} className="block rounded-3xl border border-slate-200 p-4 transition hover:border-green-500 hover:bg-slate-50">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-slate-500">{new Date(match.date).toLocaleDateString('es-ES')}</p>
              <h2 className="text-lg font-semibold text-slate-900">{match.home.name} vs {match.away.name}</h2>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-600">
              {match.status}
            </span>
          </div>
          <p className="mt-3 text-sm text-slate-600">Lugar: {match.venue}</p>
          <p className="mt-2 text-sm text-slate-700">Marcador: {match.homeGoals ?? '-'} · {match.awayGoals ?? '-'}</p>
        </Link>
      ))}
    </div>
  );
}
