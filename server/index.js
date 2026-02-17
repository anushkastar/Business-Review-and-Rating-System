import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import { authMiddleware, requireAuth, requireRole } from './auth.js';
import authRoutes from './routes/auth.js';
import businessRoutes from './routes/businesses.js';
import reviewRoutes from './routes/reviews.js';
import adminRoutes from './routes/admin.js';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(authMiddleware);

app.use('/api/auth', authRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', requireAuth, requireRole('admin'), adminRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
