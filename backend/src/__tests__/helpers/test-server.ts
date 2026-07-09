import 'dotenv/config';
import express, { Express } from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import categoryRoutes from '../../infrastructure/http/routes/categoryRoutes';
import { initializePrismaClient } from '../../infrastructure/http/controllers/CategoryController';
import path from 'path';

let server: any = null;
let prisma: PrismaClient | null = null;
let serverStarting: Promise<any> | null = null;
let serverPort: number = 0;

async function createDatabaseSchema(prismaClient: PrismaClient): Promise<void> {
  try {
    // Create all tables using Prisma's execute raw
    await prismaClient.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Category" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "color" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Team" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "crestUrl" TEXT,
        "categoryId" TEXT NOT NULL,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("categoryId") REFERENCES "Category" ("id")
      );
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Team_categoryId_idx" ON "Team" ("categoryId");
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Match" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "categoryId" TEXT NOT NULL,
        "homeId" TEXT NOT NULL,
        "awayId" TEXT NOT NULL,
        "date" DATETIME NOT NULL,
        "venue" TEXT NOT NULL,
        "status" TEXT NOT NULL,
        "homeGoals" INTEGER,
        "awayGoals" INTEGER,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("categoryId") REFERENCES "Category" ("id"),
        FOREIGN KEY ("homeId") REFERENCES "Team" ("id"),
        FOREIGN KEY ("awayId") REFERENCES "Team" ("id")
      );
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Match_categoryId_idx" ON "Match" ("categoryId");
      CREATE INDEX IF NOT EXISTS "Match_homeId_idx" ON "Match" ("homeId");
      CREATE INDEX IF NOT EXISTS "Match_awayId_idx" ON "Match" ("awayId");
      CREATE INDEX IF NOT EXISTS "Match_status_idx" ON "Match" ("status");
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Player" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "cardPhotoUrl" TEXT,
        "position" TEXT NOT NULL,
        "jerseyNumber" INTEGER,
        "teamId" TEXT NOT NULL,
        "categoryId" TEXT NOT NULL,
        "seasonPoints" REAL NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("teamId") REFERENCES "Team" ("id"),
        FOREIGN KEY ("categoryId") REFERENCES "Category" ("id")
      );
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Player_teamId_idx" ON "Player" ("teamId");
      CREATE INDEX IF NOT EXISTS "Player_categoryId_idx" ON "Player" ("categoryId");
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PlayerMatchStat" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "playerId" TEXT NOT NULL,
        "matchId" TEXT NOT NULL,
        "minutesPlayed" INTEGER NOT NULL,
        "goals" INTEGER NOT NULL DEFAULT 0,
        "cleanSheet" INTEGER NOT NULL DEFAULT 0,
        "points" REAL NOT NULL DEFAULT 0,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE ("playerId", "matchId"),
        FOREIGN KEY ("playerId") REFERENCES "Player" ("id"),
        FOREIGN KEY ("matchId") REFERENCES "Match" ("id")
      );
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "PlayerMatchStat_matchId_idx" ON "PlayerMatchStat" ("matchId");
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Sponsor" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "imageUrl" TEXT NOT NULL,
        "linkUrl" TEXT,
        "placement" TEXT NOT NULL,
        "categoryId" TEXT,
        "active" INTEGER NOT NULL DEFAULT 1,
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY ("categoryId") REFERENCES "Category" ("id")
      );
    `);

    await prismaClient.$executeRawUnsafe(`
      CREATE INDEX IF NOT EXISTS "Sponsor_categoryId_idx" ON "Sponsor" ("categoryId");
      CREATE INDEX IF NOT EXISTS "Sponsor_active_idx" ON "Sponsor" ("active");
    `);

    console.log('Database schema created successfully');
  } catch (error) {
    console.error('Error creating database schema:', error);
    throw error;
  }
}

export async function startTestServer(): Promise<{ server: any; prisma: PrismaClient }> {
  // If server is already running, return it
  if (server && prisma) {
    return { server, prisma };
  }

  // If server is starting, wait for it
  if (serverStarting) {
    return serverStarting;
  }

  // Create the server initialization promise
  serverStarting = (async () => {
    // Use SQLite in-memory database path for Prisma
    const dbPath = path.join(__dirname, '../../..', 'test.db');
    process.env.DATABASE_URL = `file:${dbPath}`;

    console.log('Starting test server with SQLite:', process.env.DATABASE_URL);

    // Create Prisma Client with SQLite
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: `file:${dbPath}`,
        },
      },
    });

    // Initialize the global Prisma client
    initializePrismaClient(prisma);

    // Create all required tables
    try {
      await createDatabaseSchema(prisma);
    } catch (error) {
      console.error('Error creating database schema:', error);
    }

    // Create Express app
    const app: Express = express();

    // Security middleware
    app.use(helmet());

    // Compression middleware
    app.use(compression());

    // CORS middleware
    app.use(cors());

    // Rate limiting - disabled for tests
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 10000, // Very high limit for testing
      message: 'Too many requests, please try again later.',
      skip: () => true, // Skip rate limiting for tests
    });
    app.use(limiter);

    // Body parser middleware
    app.use(express.json());

    // Cache control headers
    app.use((req, res, next) => {
      if (req.method === 'GET') {
        res.set('Cache-Control', 'public, max-age=300');
      } else {
        res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      }
      next();
    });

    // Routes
    app.use('/api/categories', categoryRoutes);
    app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

    // Start server on any available port
    return new Promise<{ server: any; prisma: PrismaClient }>((resolve, reject) => {
      server = app.listen(0, () => {
        serverPort = (server.address() as any).port;
        console.log(`Test server running on http://localhost:${serverPort}`);
        resolve({ server, prisma: prisma! });
      });

      server.on('error', reject);
    });
  })();

  return serverStarting;
}

export async function stopTestServer(): Promise<void> {
  if (server) {
    // Force close all connections
    server.closeAllConnections?.();

    await new Promise<void>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('Server close timeout, force destroying');
        server.destroy?.();
        resolve();
      }, 5000);

      server.close(() => {
        clearTimeout(timeout);
        console.log('Test server stopped');
        resolve();
      });
    });
    server = null;
  }

  if (prisma) {
    try {
      await prisma.$disconnect();
    } catch (error) {
      console.warn('Error disconnecting Prisma:', error);
    }
    prisma = null;
  }

  // Wait a bit for ports to be released
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Clean up test database file
  try {
    const fs = require('fs');
    const dbPath = path.join(__dirname, '../../..', 'test.db');
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  } catch (error) {
    // Ignore errors
  }
}

export async function resetDatabase(prismaClient: PrismaClient): Promise<void> {
  try {
    // Delete all data in reverse order of dependencies
    await prismaClient.playerMatchStat.deleteMany({});
    await prismaClient.player.deleteMany({});
    await prismaClient.match.deleteMany({});
    await prismaClient.sponsor.deleteMany({});
    await prismaClient.team.deleteMany({});
    await prismaClient.category.deleteMany({});
    console.log('Database reset successfully');
  } catch (error) {
    console.error('Error resetting database:', error);
  }
}

export function getServerPort(): number {
  return serverPort || 4000;
}
