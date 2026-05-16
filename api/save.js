import { put } from '@vercel/blob';
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { html, nombre, tel } = req.body;
    if (!html) return res.status(400).json({ error: 'HTML requerido' });
    const id = Math.random().toString(36).substring(2,10) + Date.now().toString(36);
    const blob = await put(`tickets/${id}.html`, html, {
      access: 'public',
      contentType: 'text/html; charset=utf-8',
      addRandomSuffix: false,
    });
    return res.status(200).json({ url: blob.url });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
