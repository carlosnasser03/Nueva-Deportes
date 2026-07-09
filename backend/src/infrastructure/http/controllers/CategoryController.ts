import { Request, Response } from 'express';
import { CategoryDTO } from '@shared';
import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

// Initialize Prisma client
export function initializePrismaClient(client?: PrismaClient) {
  if (client) {
    prisma = client;
  } else if (!prisma) {
    prisma = new PrismaClient();
  }
}

// Get the Prisma client for testing
export function getPrismaClient() {
  if (!prisma) {
    initializePrismaClient();
  }
  return prisma;
}

interface PrismaCategory {
  id: string;
  name: string;
  color: string;
}

export class CategoryController {
  constructor(private prismaClient?: PrismaClient) {}

  async list(req: Request, res: Response) {
    const client = this.prismaClient || getPrismaClient();
    const categories = await client.category.findMany();
    const result: CategoryDTO[] = categories.map((category: PrismaCategory) => ({
      id: category.id,
      name: category.name,
      color: category.color,
    }));
    res.json(result);
  }

  async create(req: Request, res: Response) {
    const client = this.prismaClient || getPrismaClient();
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        message: 'Name and color are required',
      });
    }

    try {
      const category = await client.category.create({
        data: {
          name: name.trim(),
          color: color.trim(),
        },
      });

      const result: CategoryDTO = {
        id: category.id,
        name: category.name,
        color: category.color,
      };

      res.status(201).json(result);
    } catch (error: any) {
      console.error('Create error:', error?.message || error);
      res.status(500).json({
        message: 'Failed to create category',
      });
    }
  }

  async update(req: Request, res: Response) {
    const client = this.prismaClient || getPrismaClient();
    const { id } = req.params;
    const { name, color } = req.body;

    if (!name && !color) {
      return res.status(400).json({
        message: 'At least one field (name or color) is required',
      });
    }

    try {
      const category = await client.category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({
          message: 'Categoría no encontrada',
        });
      }

      const updateData: { name?: string; color?: string } = {};
      if (name) updateData.name = name.trim();
      if (color) updateData.color = color.trim();

      const updatedCategory = await client.category.update({
        where: { id },
        data: updateData,
      });

      const result: CategoryDTO = {
        id: updatedCategory.id,
        name: updatedCategory.name,
        color: updatedCategory.color,
      };

      res.json(result);
    } catch (error: any) {
      console.error('Update error:', error?.message || error);
      res.status(500).json({
        message: 'Failed to update category',
      });
    }
  }

  async delete(req: Request, res: Response) {
    const client = this.prismaClient || getPrismaClient();
    const { id } = req.params;

    try {
      // Try to delete directly - SQLite will handle cascades
      // if configured, or we catch the constraint error
      try {
        await client.category.delete({
          where: { id },
        });
      } catch (error: any) {
        // If record not found, return 404
        if (error?.code === 'P2025') {
          return res.status(404).json({
            message: 'Categoría no encontrada',
          });
        }
        // If foreign key constraint, delete related data first
        if (error?.code === 'P2003') {
          // Delete stats first
          const matches = await client.match.findMany({
            where: { categoryId: id },
            select: { id: true },
          });
          const matchIds = matches.map(m => m.id);

          if (matchIds.length > 0) {
            await client.playerMatchStat.deleteMany({
              where: { matchId: { in: matchIds } },
            });
          }

          // Delete related entities
          await client.match.deleteMany({ where: { categoryId: id } });
          await client.player.deleteMany({ where: { categoryId: id } });
          await client.team.deleteMany({ where: { categoryId: id } });

          // Now delete the category
          await client.category.delete({ where: { id } });
        } else {
          throw error;
        }
      }

      res.status(204).send();
    } catch (error: any) {
      console.error('Delete error:', error?.message || error);
      res.status(500).json({
        message: 'Failed to delete category',
      });
    }
  }
}
