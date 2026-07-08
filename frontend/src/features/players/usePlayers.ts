import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { PlayerDTO } from '@shared/index';

export function usePlayers(categoryId: string) {
  const [players, setPlayers] = useState<PlayerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    apiClient
      .getPlayers(categoryId)
      .then(setPlayers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { players, loading, error };
}
