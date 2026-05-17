import { get } from '@vercel/blob';

export default async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('ID requerido');

  try {
    const blob = await get(`tickets/${id}.html`);
    const html = await blob.text();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.status(200).send(html);
  } catch(e) {
    return res.status(404).send('Ticket no encontrado');
  }
}
