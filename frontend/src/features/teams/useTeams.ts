import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { TeamDTO } from '@shared/index';

export function useTeams(categoryId: string) {
  const [teams, setTeams] = useState<TeamDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    apiClient
      .getTeams(categoryId)
      .then(setTeams)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { teams, loading, error };
}
