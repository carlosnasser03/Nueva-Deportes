import { PrismaClient } from '@prisma/client';
import { PrismaMatchRepository } from '../infrastructure/repositories/prisma/PrismaMatchRepository';
import { PrismaPlayerRepository } from '../infrastructure/repositories/prisma/PrismaPlayerRepository';
import { PrismaTeamRepository } from '../infrastructure/repositories/prisma/PrismaTeamRepository';
import { PrismaSponsorRepository } from '../infrastructure/repositories/prisma/PrismaSponsorRepository';

const prisma = new PrismaClient();

export const repositories = {
  matchRepository: new PrismaMatchRepository(prisma),
  playerRepository: new PrismaPlayerRepository(prisma),
  teamRepository: new PrismaTeamRepository(prisma),
  sponsorRepository: new PrismaSponsorRepository(prisma),
};
