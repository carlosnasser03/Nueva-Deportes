import express from 'express';
import cors from 'cors';
import categoryRoutes from './infrastructure/http/routes/categoryRoutes';
import matchRoutes from './infrastructure/http/routes/matchRoutes';
import playerRoutes from './infrastructure/http/routes/playerRoutes';
import teamRoutes from './infrastructure/http/routes/teamRoutes';
import standingsRoutes from './infrastructure/http/routes/standingsRoutes';
import sponsorRoutes from './infrastructure/http/routes/sponsorRoutes';
import scorerRoutes from './infrastructure/http/routes/scorerRoutes';

const app = express();
app.use(cors());
app.use(express.json());

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
  console.log(`Backend running on http://localhost:${port}`);
});
