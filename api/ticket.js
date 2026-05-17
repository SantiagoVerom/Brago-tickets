const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('ID requerido');

  try {
    const { blobs } = await list({ prefix: `tickets/${id}` });
    if (!blobs || blobs.length === 0) return res.status(404).send('Ticket no encontrado');
    
    const response = await fetch(blobs[0].url);
    const html = await response.text();
    
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(html);
  } catch(e) {
    return res.status(500).send('Error: ' + e.message);
  }
}
