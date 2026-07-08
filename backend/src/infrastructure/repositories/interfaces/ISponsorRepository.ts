export interface SponsorRecord {
  id: string;
  name: string;
  imageUrl: string;
  linkUrl: string | null;
  placement: string;
  categoryId: string | null;
  active: boolean;
}

export interface ISponsorRepository {
  findByPlacementAndCategory(placement: string, categoryId?: string): Promise<SponsorRecord[]>;
}
