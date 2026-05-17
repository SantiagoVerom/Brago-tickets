const { put, get } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'GET') {
      const { blobs } = await require('@vercel/blob').list({ prefix: 'data/brago-sync' });
      if (!blobs || blobs.length === 0) return res.status(200).json({});
      const latest = blobs.sort((a,b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];
      const response = await fetch(latest.url);
      const data = await response.json();
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      let body = req.body;
      if (typeof body === 'string') body = JSON.parse(body);
      const blob = await put('data/brago-sync.json', JSON.stringify(body), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
      });
      return res.status(200).json({ ok: true, url: blob.url });
    }
  } catch(e) {
    return res.status(500).json({ error: e.message });
  }
}
