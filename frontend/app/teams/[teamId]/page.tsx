import { TeamDetails } from '@features/teams/TeamDetails';

interface TeamPageProps {
  params: { teamId: string };
}

export default function TeamPage({ params }: TeamPageProps) {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="mx-auto max-w-5xl p-4">
        <TeamDetails teamId={params.teamId} />
      </div>
    </main>
  );
}
