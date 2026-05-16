import { kv } from '@vercel/kv';
export default async function handler(req, res) {
  const { id } = req.query;
  try {
    const raw = await kv.get('t:' + id);
    if (!raw) return res.status(404).send('<h2>Ticket no encontrado</h2>');
    const ticket = typeof raw === 'string' ? JSON.parse(raw) : raw;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.status(200).send(ticket.html);
  } catch(e) {
    return res.status(500).send('Error');
  }
}
