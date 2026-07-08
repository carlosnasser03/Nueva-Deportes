import type { SponsorDTO } from '@shared/index';

interface SponsorListProps {
  sponsors: SponsorDTO[];
}

export function SponsorList({ sponsors }: SponsorListProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Patrocinadores</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {sponsors.map((sponsor) => (
          <a key={sponsor.id} href={sponsor.linkUrl ?? '#'} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 rounded-3xl bg-slate-50 p-4 transition hover:bg-slate-100">
            <div>
              <p className="font-semibold text-slate-900">{sponsor.name}</p>
              <p className="text-sm text-slate-500">{sponsor.placement}</p>
            </div>
            {sponsor.imageUrl ? (
              <div className="h-16 w-16 overflow-hidden rounded-2xl bg-white shadow-sm">
                <img src={sponsor.imageUrl} alt={sponsor.name} className="h-full w-full object-cover" />
              </div>
            ) : null}
          </a>
        ))}
      </div>
    </div>
  );
}
