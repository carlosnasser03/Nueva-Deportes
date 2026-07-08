export interface PlayerRecord {
  id: string;
  name: string;
  cardPhotoUrl: string | null;
  position: string;
  jerseyNumber: number | null;
  teamId: string;
  categoryId: string;
  seasonPoints: number;
  goals: number;
  stats: Array<{
    matchId: string;
    match: { id: string; date: Date };
    minutesPlayed: number;
    goals: number;
    points: number;
  }>;
}

export interface PlayerMatchStatPayload {
  playerId: string;
  matchId: string;
  minutesPlayed: number;
  goals: number;
  cleanSheet: boolean;
  points: number;
}

export interface IPlayerRepository {
  findByCategory(categoryId: string): Promise<PlayerRecord[]>;
  findById(playerId: string): Promise<PlayerRecord | null>;
  findByTeam(teamId: string): Promise<PlayerRecord[]>;
  findTopScorersByCategory(categoryId: string): Promise<PlayerRecord[]>;
  createPlayerMatchStat(payload: PlayerMatchStatPayload): Promise<void>;
  refreshSeasonPoints(categoryId: string): Promise<void>;
}
