"use client";

import { useSponsors } from './useSponsors';
import { SponsorList } from './SponsorList';

interface SponsorsScreenProps {
  categoryId: string;
}

export function SponsorsScreen({ categoryId }: SponsorsScreenProps) {
  const { sponsors, loading, error } = useSponsors(categoryId);

  if (loading) return <p className="p-6 text-slate-500">Cargando patrocinadores...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (sponsors.length === 0) return <p className="p-6 text-slate-500">No hay patrocinadores para esta categoría.</p>;

  return (
    <section className="space-y-4 p-4">
      <header className="space-y-2">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Patrocinadores</p>
        <h1 className="text-2xl font-semibold text-slate-900">Aliados de la categoría</h1>
      </header>
      <SponsorList sponsors={sponsors} />
    </section>
  );
}
