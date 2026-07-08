import { PlayerProfile } from '@features/players/PlayerProfile';

interface PlayerPageProps {
  params: { playerId: string };
}

export default function PlayerPage({ params }: PlayerPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl p-4">
        <PlayerProfile playerId={params.playerId} />
      </div>
    </main>
  );
}
