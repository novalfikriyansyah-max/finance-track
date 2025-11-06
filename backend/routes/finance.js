import express from 'express';
import pool from '../db.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/add', auth, async (req, res) => {
  const { type, amount, note } = req.body;
  try {
    await pool.query(
      'INSERT INTO transactions (user_id, type, amount, note) VALUES ($1, $2, $3, $4)',
      [req.user.id, type, amount, note]
    );
    res.json({ message: 'Transaksi berhasil disimpan' });
  } catch {
    res.status(500).json({ error: 'Gagal menyimpan transaksi' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil data' });
  }
});

export default router;
