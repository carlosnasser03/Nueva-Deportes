import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { StandingRowDTO } from '@shared/index';

export function useStandings(categoryId: string) {
  const [standings, setStandings] = useState<StandingRowDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    apiClient
      .getStandings(categoryId)
      .then(setStandings)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { standings, loading, error };
}
