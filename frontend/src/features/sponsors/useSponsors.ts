import { useEffect, useState } from 'react';
import { apiClient } from '@lib/apiClient';
import type { SponsorDTO } from '@shared/index';

export function useSponsors(categoryId: string) {
  const [sponsors, setSponsors] = useState<SponsorDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) return;
    setLoading(true);
    apiClient
      .getSponsors('homepage', categoryId)
      .then(setSponsors)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return { sponsors, loading, error };
}
