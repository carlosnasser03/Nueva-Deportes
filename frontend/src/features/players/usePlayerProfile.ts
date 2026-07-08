import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { PlayerProfileDTO } from '@shared/index';

export function usePlayerProfile(playerId: string) {
  const [player, setPlayer] = useState<PlayerProfileDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!playerId) return;
    setLoading(true);
    apiClient
      .getPlayerProfile(playerId)
      .then(setPlayer)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [playerId]);

  return { player, loading, error };
}
