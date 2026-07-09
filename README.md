# DeporteHN - Sports League Management Platform

A full-stack web application for managing sports leagues, teams, players, and matches with real-time standings and scoring.

## Features

- **Category Management**: Create and manage multiple sports categories
- **Team Management**: Register teams with logo/crest URLs
- **Player Management**: Track player profiles, positions, and stats
- **Match Management**: Record match results and player performance
- **Live Standings**: Automatic calculation and display of league standings
- **Scoring System**: Points-based scoring engine with customizable scoring rules
- **Top Scorers**: Track leading scorers by goals and points
- **Sponsor Management**: Manage league sponsors with placement control

## Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (development) / PostgreSQL (production-ready)
- **ORM**: Prisma
- **Language**: TypeScript
- **Testing**: Vitest
- **Security**: Helmet, CORS, rate limiting
- **Performance**: gzip compression, caching

### Frontend
- **Framework**: Next.js 14+ (React)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Performance**: Static generation, image optimization

### Shared
- **DTOs**: TypeScript interfaces shared between frontend and backend
- **Type Safety**: Full end-to-end type safety

## Project Structure

```
├── backend/                    # Express.js server
│   ├── src/
│   │   ├── domain/            # Business logic
│   │   ├── application/       # Service layer
│   │   ├── infrastructure/    # HTTP, database, external services
│   │   └── __tests__/         # Test suite
│   └── prisma/                # Database schema
├── frontend/                   # Next.js app
│   ├── src/
│   │   ├── app/              # Next.js app directory
│   │   ├── features/         # Feature modules
│   │   ├── lib/              # Utilities, API client
│   │   └── components/       # Reusable components
├── shared/                    # Shared types and utilities
└── package.json              # Monorepo configuration
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm 8+

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update backend/.env with your database URL
# For development: DATABASE_URL=file:./test.db

# Update frontend/.env if needed
# NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

### Development

```bash
# Start backend (runs on http://localhost:4000)
npm run start --workspace backend

# In another terminal, start frontend (runs on http://localhost:3000)
npm run dev --workspace frontend
```

### Building

```bash
# Build both backend and frontend
npm run build

# Build only backend
npm run build --workspace backend

# Build only frontend
npm run build --workspace frontend
```

### Testing

```bash
# Run all tests
npm run test

# Backend tests include:
# - CRUD operations for all resources
# - Concurrent operations (race condition testing)
# - Stress tests with 15 concurrent users
# - Memory leak detection
```

## API Endpoints

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create a category
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category

### Teams
- `GET /api/categories/:categoryId/teams` - List teams in category
- `POST /api/teams` - Create a team
- `GET /api/teams/:teamId` - Get team details with players

### Players
- `GET /api/categories/:categoryId/players` - List players in category
- `GET /api/players/:playerId` - Get player profile

### Matches
- `GET /api/categories/:categoryId/matches` - List matches in category
- `GET /api/matches/:matchId` - Get match details
- `POST /api/matches/:matchId/result` - Record match result

### Standings & Scoring
- `GET /api/categories/:categoryId/standings` - Get league standings
- `GET /api/categories/:categoryId/scorers` - Get top scorers

### Sponsors
- `GET /api/sponsors` - List sponsors by placement

## Performance Optimizations

- **Frontend**
  - Next.js static generation for improved load times
  - Image optimization with AVIF/WebP formats
  - CSS and JS minification
  - Optimized font loading
  - Bundle size < 105KB (gzipped)

- **Backend**
  - gzip compression
  - Caching headers for GET requests
  - Rate limiting (100 requests per 15 minutes)
  - Database indexes on frequently queried fields
  - Optimized season points calculation (batch updates)

- **Database**
  - Indexes on: categoryId, teamId, status, matchId
  - Efficient relationship queries with Prisma includes
  - Transaction support for data consistency

## Security

- HTTPS-ready with Helmet security headers
- CORS configured for controlled access
- Input validation on all endpoints
- Rate limiting to prevent abuse
- No hardcoded secrets in codebase
- Environment variable configuration
- SQL injection protection via Prisma ORM
- XSS protection via Helmet headers

## Quality Metrics

### Test Coverage
- **Unit Tests**: 9 CRUD operation tests
- **Integration Tests**: Cross-layer API tests
- **Stress Tests**: 15 concurrent users
- **Memory Tests**: Leak detection
- **Total**: 12/12 tests passing

### Code Quality
- Full TypeScript type safety
- ESLint configuration (if configured)
- Consistent naming conventions
- Clean architecture with layered design

### Commits
- Descriptive commit messages
- Feature/fix/perf/chore classification
- All changes tracked in git history

## Environment Variables

### Backend (.env)
```
DATABASE_URL=file:./test.db
PORT=4000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_GA_ID=
NEXT_TELEMETRY_DISABLED=1
```

## Deployment

### Backend
- Deploy to services like Heroku, Railway, or DigitalOcean
- Use PostgreSQL for production instead of SQLite
- Set NODE_ENV=production
- Configure CORS_ORIGIN for your domain

### Frontend
- Deploy to Vercel (recommended for Next.js)
- Set NEXT_PUBLIC_API_URL to your backend URL
- Automatic builds and deployments on git push

## Health Check

```bash
curl http://localhost:4000/api/health
# Response: {"status":"ok"}
```

## Contributing

1. Create feature branches from main
2. Follow commit message conventions
3. Ensure all tests pass before submitting PR
4. Update .env.example files if adding new variables

## License

Proprietary - All rights reserved

## Support

For issues and questions, please contact the development team.
