import type { CategoryDTO, MatchDTO, PlayerDTO, PlayerProfileDTO, ScorerDTO, SponsorDTO, StandingRowDTO, TeamDTO } from '@shared/index';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const jsonHeaders = { 'Content-Type': 'application/json' };

const fetcher = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`API error ${response.status}`);
  }
  return response.json();
};

export const apiClient = {
  getCategories: (): Promise<CategoryDTO[]> => fetcher(`${BASE_URL}/categories`),
  createCategory: (payload: { name: string; color: string }): Promise<CategoryDTO> =>
    fetch(`${BASE_URL}/categories`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) throw new Error(`API error ${response.status}`);
      return response.json();
    }),
  updateCategory: (categoryId: string, payload: { name: string; color: string }): Promise<CategoryDTO> =>
    fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: 'PUT',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) throw new Error(`API error ${response.status}`);
      return response.json();
    }),
  deleteCategory: (categoryId: string): Promise<void> =>
    fetch(`${BASE_URL}/categories/${categoryId}`, {
      method: 'DELETE',
      headers: jsonHeaders,
    }).then((response) => {
      if (!response.ok) throw new Error(`API error ${response.status}`);
    }),
  getStandings: (categoryId: string): Promise<StandingRowDTO[]> => fetcher(`${BASE_URL}/categories/${categoryId}/standings`),
  getMatches: (categoryId: string, status?: string): Promise<MatchDTO[]> =>
    fetcher(`${BASE_URL}/categories/${categoryId}/matches${status ? `?status=${status}` : ''}`),
  getMatchDetails: (matchId: string): Promise<any> => fetcher(`${BASE_URL}/matches/${matchId}`),
  recordMatchResult: (matchId: string, payload: any): Promise<void> =>
    fetch(`${BASE_URL}/matches/${matchId}/result`, {
      method: 'POST',
      headers: jsonHeaders,
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) throw new Error(`API error ${response.status}`);
    }),
  getPlayerProfile: (playerId: string): Promise<PlayerProfileDTO> => fetcher(`${BASE_URL}/players/${playerId}`),
  getPlayers: (categoryId: string): Promise<PlayerDTO[]> => fetcher(`${BASE_URL}/categories/${categoryId}/players`),
  getTeams: (categoryId: string): Promise<TeamDTO[]> => fetcher(`${BASE_URL}/categories/${categoryId}/teams`),
  getTeam: (teamId: string): Promise<{ team: TeamDTO; players: PlayerDTO[] }> => fetcher(`${BASE_URL}/teams/${teamId}`),
  getScorers: (categoryId: string): Promise<ScorerDTO[]> => fetcher(`${BASE_URL}/categories/${categoryId}/scorers`),
  getSponsors: (placement: string, categoryId?: string): Promise<SponsorDTO[]> =>
    fetcher(`${BASE_URL}/sponsors?placement=${encodeURIComponent(placement)}${categoryId ? `&categoryId=${encodeURIComponent(categoryId)}` : ''}`),
};
