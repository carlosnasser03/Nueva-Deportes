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
import scorerRoutes from './infrastructure/http/routes/scorerRoutes';

const app = express();

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression());

// CORS middleware
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});
app.use(limiter);

// Body parser middleware
app.use(express.json());

// Cache control headers
app.use((req, res, next) => {
  // Cache GET requests for 5 minutes
  if (req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');
  } else {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  next();
});

app.use('/api/categories', categoryRoutes);
app.use('/api', matchRoutes);
app.use('/api', playerRoutes);
app.use('/api', teamRoutes);
app.use('/api', standingsRoutes);
app.use('/api', sponsorRoutes);
app.use('/api', scorerRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`Backend running on http://localhost:${port}`);
  }
});
