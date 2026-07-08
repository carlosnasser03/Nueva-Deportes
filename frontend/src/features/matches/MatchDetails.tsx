"use client";

import { useState } from 'react';
import { useMatchDetails } from './useMatchDetails';
import { apiClient } from '@lib/apiClient';
import Link from 'next/link';

interface MatchDetailsProps {
  matchId: string;
}

export function MatchDetails({ matchId }: MatchDetailsProps) {
  const { data, loading, error } = useMatchDetails(matchId);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  if (loading) return <p className="p-6 text-slate-500">Cargando partido...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;
  if (!data) return <p className="p-6 text-slate-500">Partido no encontrado.</p>;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    const formData = new FormData(event.currentTarget);
    const homeGoals = Number(formData.get('homeGoals'));
    const awayGoals = Number(formData.get('awayGoals'));
    const playerRatings = data.ratings.map((item) => ({
      playerId: item.player.id,
      minutesPlayed: Number(formData.get(`minutes_${item.player.id}`)) || 0,
      goals: Number(formData.get(`goals_${item.player.id}`)) || 0,
    }));

    try {
      await apiClient.recordMatchResult(data.match.id, { matchId: data.match.id, homeGoals, awayGoals, playerRatings });
      setMessage('Resultado guardado con éxito.');
    } catch (err: any) {
      setMessage(err.message || 'No se pudo guardar el resultado.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 rounded-3xl bg-white p-6 shadow-sm">
      <header className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-center">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Partido</p>
          <h1 className="text-3xl font-semibold text-slate-900">{data.match.home.name} vs {data.match.away.name}</h1>
          <p className="text-sm text-slate-500">{new Date(data.match.date).toLocaleDateString('es-ES')} · {data.match.venue}</p>
        </div>
        <div className="text-right">
          <Link href="/" className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200">
            Volver al inicio
          </Link>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Goles {data.match.home.name}</p>
            <input name="homeGoals" type="number" defaultValue={data.match.homeGoals ?? 0} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900" />
          </label>
          <label className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Goles {data.match.away.name}</p>
            <input name="awayGoals" type="number" defaultValue={data.match.awayGoals ?? 0} className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900" />
          </label>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-slate-500">Calificaciones de jugadores</p>
          <div className="space-y-4">
            {data.ratings.map((rating) => (
              <div key={rating.player.id} className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
                <div>
                  <p className="font-semibold text-slate-900">{rating.player.name}</p>
                  <p className="text-sm text-slate-500">Equipo: {rating.player.teamId}</p>
                </div>
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Minutos</span>
                  <input name={`minutes_${rating.player.id}`} type="number" defaultValue={0} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900" />
                </label>
                <label className="grid gap-2">
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Goles</span>
                  <input name={`goals_${rating.player.id}`} type="number" defaultValue={0} className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900" />
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {message ? <p className="text-sm text-slate-600">{message}</p> : null}
          <button type="submit" disabled={saving} className="rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Guardando...' : 'Guardar resultado'}
          </button>
        </div>
      </form>
    </div>
  );
}
