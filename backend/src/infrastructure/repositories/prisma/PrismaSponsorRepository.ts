import { PrismaClient } from '@prisma/client';
import { ISponsorRepository, SponsorRecord } from '../interfaces/ISponsorRepository';

export class PrismaSponsorRepository implements ISponsorRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByPlacementAndCategory(placement: string, categoryId?: string): Promise<SponsorRecord[]> {
    return this.prisma.sponsor.findMany({
      where: {
        placement,
        active: true,
        categoryId: categoryId ?? undefined,
      },
    });
  }
}
