export interface MatchRecord {
  id: string;
  categoryId: string;
  homeId: string;
  awayId: string;
  date: Date;
  venue: string;
  status: string;
  homeGoals: number | null;
  awayGoals: number | null;
  home?: { id: string; name: string };
  away?: { id: string; name: string };
  category?: { id: string };
}

export interface IMatchRepository {
  findByCategory(categoryId: string, status?: string): Promise<MatchRecord[]>;
  findById(matchId: string): Promise<MatchRecord | null>;
  findByIdWithDetails(matchId: string): Promise<MatchRecord | null>;
  updateScore(matchId: string, homeGoals: number, awayGoals: number): Promise<void>;
}
