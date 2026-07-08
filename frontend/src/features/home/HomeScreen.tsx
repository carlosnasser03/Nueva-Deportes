"use client";

import { useState } from 'react';
import { useCategories } from '../categories/useCategories';
import { CategorySelector } from '../categories/CategorySelector';
import { StandingsScreen } from '../standings/StandingsScreen';
import { MatchesScreen } from '../matches/MatchesScreen';
import { PlayersScreen } from '../players/PlayersScreen';
import { ScorersScreen } from '../scorers/ScorersScreen';
import { TeamsScreen } from '../teams/TeamsScreen';
import { SponsorsScreen } from '../sponsors/SponsorsScreen';

export function HomeScreen() {
  const { categories, loading, error } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  if (loading) return <p className="p-6 text-slate-500">Cargando categorías...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  const categoryId = selectedCategoryId || categories[0]?.id || '';

  return (
    <div className="space-y-8">
      {/* Header Hero */}
      <header className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-green-900 px-8 py-12 shadow-lg">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(34,197,94,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(71,85,105,0.1),transparent_50%)]" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">⚽</span>
            <h1 className="text-4xl font-bold text-white">DeporteHN</h1>
          </div>
          <p className="text-slate-200 text-base font-medium">Sigue resultados, clasificaciones y partidos de tu categoría favorita</p>
        </div>
      </header>

      {/* Category Selector Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-1">Selecciona una categoría</h2>
          <p className="text-xs text-slate-500">Cambia entre diferentes categorías para ver sus resultados</p>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-slate-200">
          <CategorySelector
            categories={categories}
            selectedCategoryId={categoryId}
            onSelect={setSelectedCategoryId}
          />
        </div>
      </section>

      {/* Grid Stats Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-1">Información de la categoría</h2>
          <p className="text-xs text-slate-500">Tabla de posiciones, goleadores, equipos y patrocinadores</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg">📊</span>
                Tabla de Posiciones
              </h3>
            </div>
            <StandingsScreen categoryId={categoryId} />
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-amber-50 to-yellow-100 px-6 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg">🔝</span>
                Máximos Goleadores
              </h3>
            </div>
            <ScorersScreen categoryId={categoryId} />
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-100 px-6 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg">👥</span>
                Equipos
              </h3>
            </div>
            <TeamsScreen categoryId={categoryId} />
          </div>

          <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div className="bg-gradient-to-r from-purple-50 to-pink-100 px-6 py-3 border-b border-slate-200">
              <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <span className="text-lg">🎯</span>
                Patrocinadores
              </h3>
            </div>
            <SponsorsScreen categoryId={categoryId} />
          </div>
        </div>
      </section>

      {/* Full Width Sections */}
      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-1">Próximos eventos</h2>
          <p className="text-xs text-slate-500">Calendario completo de partidos</p>
        </div>
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-100 px-6 py-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-lg">📅</span>
              Partidos
            </h3>
          </div>
          <MatchesScreen categoryId={categoryId} />
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-600 mb-1">Plantilla</h2>
          <p className="text-xs text-slate-500">Jugadores registrados en la categoría</p>
        </div>
        <div className="rounded-xl bg-white shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
          <div className="bg-gradient-to-r from-green-50 to-emerald-100 px-6 py-3 border-b border-slate-200">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="text-lg">👤</span>
              Jugadores
            </h3>
          </div>
          <PlayersScreen categoryId={categoryId} />
        </div>
      </section>
    </div>
  );
}
