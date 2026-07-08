import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { ScorerDTO } from '@shared/index';

export function useScorers(categoryId: string) {
  const [scorers, setScorers] = useState<ScorerDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    apiClient
      .getScorers(categoryId)
      .then(setScorers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { scorers, loading, error };
}
