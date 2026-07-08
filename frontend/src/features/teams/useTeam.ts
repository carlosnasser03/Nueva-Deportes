import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { PlayerDTO, TeamDTO } from '@shared/index';

interface TeamDetailResponse {
  team: TeamDTO;
  players: PlayerDTO[];
}

export function useTeam(teamId: string) {
  const [team, setTeam] = useState<TeamDTO | null>(null);
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) return;
    setLoading(true);
    apiClient
      .getTeam(teamId)
      .then((response: TeamDetailResponse) => {
        setTeam(response.team);
        setPlayers(response.players);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [teamId]);

  return { team, players, loading, error };
}
