import express from 'express';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Nanti akan dihubungkan ke API OCR (misal OpenAI Vision)
router.post('/scan', upload.single('image'), async (req, res) => {
  try {
    res.json({ message: 'Fitur OCR akan segera aktif', file: req.file });
  } catch {
    res.status(500).json({ error: 'Gagal memproses resi' });
  }
});

export default router;
