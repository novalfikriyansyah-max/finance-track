import { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';

function getToken() {
  return localStorage.getItem('token');
}

export default function Dashboard() {
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(()=> { fetchTxs(); }, []);

  async function fetchTxs() {
    setLoading(true);
    const res = await fetch(`${api}/transactions`, {
      headers: { Authorization: `Bearer ${getToken()}` }
    });
    if (res.ok) {
      const j = await res.json();
      setTransactions(j);
    } else {
      setTransactions([]);
    }
    setLoading(false);
  }

  async function runOCR() {
    if (!file) return alert('Pilih file');
    setText('Scanning...');
    try {
      const { data: { text: ocr } } = await Tesseract.recognize(file, 'ind');
      setText(ocr);
    } catch (e) {
      setText('');
      alert('OCR error: ' + e.message);
    }
  }

  async function parseText() {
    if (!text) return alert('Jalankan OCR atau masukkan teks');
    setParsing(true);
    try {
      const res = await fetch(`${api}/parse`, {
        method: 'POST',
        headers: {'Content-Type':'application/json', Authorization: `Bearer ${getToken()}`},
        body: JSON.stringify({ text })
      });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Parse failed');
      setParsed(j);
    } catch (e) {
      alert(e.message);
    } finally { setParsing(false); }
  }

  async function saveConfirmed() {
    if (!parsed) return;
    const res = await fetch(`${api}/transactions`, {
      method: 'POST',
      headers: {'Content-Type':'application/json', Authorization: `Bearer ${getToken()}`},
      body: JSON.stringify({ ...parsed, status: 'confirmed' })
    });
    if (res.ok) {
      setParsed(null);
      fetchTxs();
    } else {
      const j = await res.json();
      alert(j.error || 'Save failed');
    }
  }

  function logout() { localStorage.removeItem('token'); location.href = '/login'; }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-white p-4 border-r">
        <h3 className="font-semibold text-lg">Dashboard</h3>
        <div className="mt-6">
          <button onClick={()=>location.href='/dashboard'} className="block mb-2">Home</button>
          <button onClick={logout} className="block text-sm text-red-600">Logout</button>
        </div>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-4">Scan & Catat Transaksi</h1>

        <section className="bg-white p-4 rounded shadow mb-6">
          <div className="mb-3">
            <input type="file" accept="image/*" onChange={e=>setFile(e.target.files[0])} />
            <button onClick={runOCR} className="ml-3 px-3 py-1 bg-sky-600 text-white rounded">Jalankan OCR</button>
          </div>
          <div className="mb-3">
            <textarea rows="6" className="w-full border p-2" value={text} onChange={e=>setText(e.target.value)} placeholder="Hasil OCR muncul di sini, bisa juga paste teks m-banking"></textarea>
          </div>
          <div>
            <button onClick={parseText} className="px-3 py-1 bg-emerald-600 text-white rounded" disabled={parsing}>{parsing ? 'Parsing...' : 'Parse & Strukturkan'}</button>
          </div>
        </section>

        {parsed && (
          <section className="bg-white p-4 rounded shadow mb-6">
            <h2 className="font-semibold mb-2">Preview (Edit jika perlu)</h2>
            <label className="block mb-2">Tanggal
              <input className="w-full border p-2" value={parsed.date||''} onChange={e=>setParsed({...parsed, date:e.target.value})}/>
            </label>
            <label className="block mb-2">Jumlah
              <input className="w-full border p-2" value={parsed.amount||''} onChange={e=>setParsed({...parsed, amount:e.target.value})}/>
            </label>
            <label className="block mb-2">Merchant
              <input className="w-full border p-2" value={parsed.merchant||''} onChange={e=>setParsed({...parsed, merchant:e.target.value})}/>
            </label>
            <label className="block mb-2">Kategori
              <input className="w-full border p-2" value={parsed.category||''} onChange={e=>setParsed({...parsed, category:e.target.value})}/>
            </label>
            <label className="block mb-2">Note
              <input className="w-full border p-2" value={parsed.note||''} onChange={e=>setParsed({...parsed, note:e.target.value})}/>
            </label>
            <div className="flex gap-2 mt-3">
              <button onClick={saveConfirmed} className="px-3 py-1 bg-sky-600 text-white rounded">Konfirmasi & Simpan</button>
              <button onClick={()=>setParsed(null)} className="px-3 py-1 border rounded">Batal</button>
            </div>
          </section>
        )}

        <section className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-3">Riwayat Transaksi</h2>
          {loading ? <div>Memuat...</div> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left"><th>ID</th><th>Tanggal</th><th>Jumlah</th><th>Merchant</th><th>Kategori</th></tr></thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id}><td>{t.id}</td><td>{t.date}</td><td>{t.amount}</td><td>{t.merchant}</td><td>{t.category}</td></tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
}
