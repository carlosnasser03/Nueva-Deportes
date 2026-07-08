import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { MatchDTO, PlayerMatchRatingDTO } from '@shared/index';

interface MatchDetailsResponse {
  match: MatchDTO;
  ratings: Array<PlayerMatchRatingDTO & { player: { id: string; name: string; teamId: string } }>;
}

export function useMatchDetails(matchId: string) {
  const [data, setData] = useState<MatchDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!matchId) return;
    setLoading(true);
    apiClient
      .getMatchDetails(matchId)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [matchId]);

  return { data, loading, error };
}
