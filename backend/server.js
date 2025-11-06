import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import financeRoutes from './routes/finance.js';
import ocrRoutes from './routes/ocr.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('✅ API berjalan dengan baik'));

app.use('/api/auth', authRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/ocr', ocrRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server berjalan di port ${PORT}`));
