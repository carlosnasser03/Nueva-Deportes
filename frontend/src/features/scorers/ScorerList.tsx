import type { ScorerDTO } from '@shared/index';

interface ScorerListProps {
  scorers: ScorerDTO[];
}

export function ScorerList({ scorers }: ScorerListProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Goleadores</p>
        <p className="text-xs text-slate-400">Top {scorers.length}</p>
      </div>
      <div className="space-y-3">
        {scorers.map((scorer, index) => (
          <div key={scorer.player.id} className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-3">
            <div>
              <p className="font-medium text-slate-900">{index + 1}. {scorer.player.name}</p>
              <p className="text-sm text-slate-500">Equipo: {scorer.player.teamId}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-slate-900">{scorer.goals}</p>
              <p className="text-xs uppercase tracking-[0.12em] text-slate-500">goles</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
