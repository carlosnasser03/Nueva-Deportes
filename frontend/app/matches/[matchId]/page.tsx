import { MatchDetails } from '@features/matches/MatchDetails';

interface MatchPageProps {
  params: { matchId: string };
}

export default function MatchPage({ params }: MatchPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl p-4">
        <MatchDetails matchId={params.matchId} />
      </div>
    </main>
  );
}
