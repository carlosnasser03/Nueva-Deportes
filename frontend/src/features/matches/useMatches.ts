import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { MatchDTO } from '@shared/index';

export function useMatches(categoryId: string) {
  const [matches, setMatches] = useState<MatchDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    apiClient
      .getMatches(categoryId)
      .then(setMatches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { matches, loading, error };
}
