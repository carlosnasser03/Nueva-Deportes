import { StandingRowDTO } from '@shared/index';

interface StandingsTableProps {
  rows: StandingRowDTO[];
}

export function StandingsTable({ rows }: StandingsTableProps) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <table className="w-full text-left text-sm text-slate-700">
        <thead>
          <tr>
            <th className="pb-3">#</th>
            <th className="pb-3">Equipo</th>
            <th className="pb-3">PJ</th>
            <th className="pb-3">G</th>
            <th className="pb-3">E</th>
            <th className="pb-3">P</th>
            <th className="pb-3">GF</th>
            <th className="pb-3">GC</th>
            <th className="pb-3">DIF</th>
            <th className="pb-3">Pts</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.team.id} className="border-t border-slate-200">
              <td className="py-2 font-semibold">{row.position}</td>
              <td className="py-2">{row.team.name}</td>
              <td className="py-2">{row.played}</td>
              <td className="py-2">{row.won}</td>
              <td className="py-2">{row.drawn}</td>
              <td className="py-2">{row.lost}</td>
              <td className="py-2">{row.goalsFor}</td>
              <td className="py-2">{row.goalsAgainst}</td>
              <td className="py-2">{row.goalDiff}</td>
              <td className="py-2 font-semibold">{row.points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
