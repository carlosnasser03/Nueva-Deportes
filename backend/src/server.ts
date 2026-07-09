import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import categoryRoutes from './infrastructure/http/routes/categoryRoutes';
import matchRoutes from './infrastructure/http/routes/matchRoutes';
import playerRoutes from './infrastructure/http/routes/playerRoutes';
import teamRoutes from './infrastructure/http/routes/teamRoutes';
import standingsRoutes from './infrastructure/http/routes/standingsRoutes';
import sponsorRoutes from './infrastructure/http/routes/sponsorRoutes';

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requests por ventana
  message: 'Demasiadas solicitudes',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parser
app.use(express.json());

// Logging condicional
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Rutas
app.use('/api/categories', categoryRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/standings', standingsRoutes);
app.use('/api/sponsors', sponsorRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
