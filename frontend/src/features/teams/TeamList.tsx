"use client";

import Link from 'next/link';
import type { TeamDTO } from '@shared/index';

interface TeamListProps {
  teams: TeamDTO[];
}

export function TeamList({ teams }: TeamListProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {teams.map((team) => (
        <Link key={team.id} href={`/teams/${team.id}`} className="block rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green-500 hover:bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 overflow-hidden rounded-full bg-slate-100">
              {team.crestUrl ? <img src={team.crestUrl} alt={team.name} className="h-full w-full object-cover" /> : null}
            </div>
            <div>
              <p className="text-lg font-semibold text-slate-900">{team.name}</p>
              <p className="text-sm text-slate-500">Categoría: {team.categoryId}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
