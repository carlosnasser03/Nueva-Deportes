export interface CategoryRecord {
  id: string;
  name: string;
  color: string;
}

export interface ICategoryRepository {
  findAll(): Promise<CategoryRecord[]>;
}
