import { Request, Response } from 'express';
import { CategoryDTO } from '@shared';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PrismaCategory {
  id: string;
  name: string;
  color: string;
}

export class CategoryController {
  async list(req: Request, res: Response) {
    const categories = await prisma.category.findMany();
    const result: CategoryDTO[] = categories.map((category: PrismaCategory) => ({
      id: category.id,
      name: category.name,
      color: category.color,
    }));
    res.json(result);
  }

  async create(req: Request, res: Response) {
    const { name, color } = req.body;

    if (!name || !color) {
      return res.status(400).json({
        message: 'Name and color are required',
      });
    }

    try {
      const category = await prisma.category.create({
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
    } catch (error) {
      res.status(500).json({
        message: 'Failed to create category',
      });
    }
  }

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, color } = req.body;

    if (!name && !color) {
      return res.status(400).json({
        message: 'At least one field (name or color) is required',
      });
    }

    try {
      const category = await prisma.category.findUnique({
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

      const updatedCategory = await prisma.category.update({
        where: { id },
        data: updateData,
      });

      const result: CategoryDTO = {
        id: updatedCategory.id,
        name: updatedCategory.name,
        color: updatedCategory.color,
      };

      res.json(result);
    } catch (error) {
      res.status(500).json({
        message: 'Failed to update category',
      });
    }
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const category = await prisma.category.findUnique({
        where: { id },
      });

      if (!category) {
        return res.status(404).json({
          message: 'Categoría no encontrada',
        });
      }

      await prisma.category.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete category',
      });
    }
  }
}
