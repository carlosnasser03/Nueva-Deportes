import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-semibold text-slate-900">
          DeporteHN
        </Link>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          <Link href="/" className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-100">
            Inicio
          </Link>
          <Link href="/categories" className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-100">
            Categorías
          </Link>
          <Link href="/teams" className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-100">
            Equipos
          </Link>
          <Link href="/players" className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-100">
            Jugadores
          </Link>
          <Link href="/matches" className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-100">
            Partidos
          </Link>
          <Link href="/sponsors" className="rounded-full border border-slate-200 px-3 py-2 hover:bg-slate-100">
            Patrocinadores
          </Link>
        </div>
      </div>
    </nav>
  );
}
