export interface TeamRecord {
  id: string;
  name: string;
  crestUrl: string | null;
  categoryId: string;
}

export interface ITeamRepository {
  findById(teamId: string): Promise<TeamRecord | null>;
  findByCategory(categoryId: string): Promise<TeamRecord[]>;
}
