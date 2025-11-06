import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import bodyParser from "body-parser";
import { Pool } from "pg";

dotenv.config();
const app = express();
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("FinanceTrack Backend OK ✅");
});

app.post("/parse-receipt", async (req, res) => {
  const { text } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah asisten yang mengubah teks resi jadi data keuangan terstruktur (nama toko, tanggal, total, kategori).",
        },
        { role: "user", content: text },
      ],
    });

    const parsed = response.choices[0].message.content;
    res.json({ parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Gagal memproses resi" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
