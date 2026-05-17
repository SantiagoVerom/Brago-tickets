const { put } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);
    if (!body || !body.html) return res.status(400).json({error:'HTML requerido'});

    const id = Math.random().toString(36).substring(2,10) + Date.now().toString(36);
    const blob = await put(`tickets/${id}.html`, body.html, {
      access: 'public',
      contentType: 'text/html; charset=utf-8',
      addRandomSuffix: false,
    });

    return res.status(200).json({ url: blob.url });
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
