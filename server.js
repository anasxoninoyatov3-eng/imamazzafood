const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files (if you want to host frontend from same server)
app.use(express.static(path.join(__dirname)));

// Health
app.get('/api/health', (req, res) => res.json({ ok: true, time: Date.now() }));

// POST /api/send-order
// Body: { order: { id, name, phone, address, items, total, ts } }
app.post('/api/send-order', async (req, res) => {
  try {
    const { order } = req.body || {};
    if (!order || !order.name || !order.phone) return res.status(400).json({ ok: false, error: 'Missing order data' });

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID; // target user/chat
    if (!BOT_TOKEN || !CHAT_ID) return res.status(500).json({ ok: false, error: 'Telegram credentials not configured' });

    // Build message text (simple, plain text)
    let text = `📦 New order received\nID: ${order.id || 'n/a'}\nName: ${order.name}\nPhone: ${order.phone}\nAddress: ${order.address || '-'}\n\nItems:\n`;
    try {
      const items = order.items || {};
      Object.keys(items).forEach(k => {
        const it = items[k];
        text += `• ${it.name} × ${it.qty} — ${it.price} each\n`;
      });
    } catch (e) {
      text += '(could not parse items)\n';
    }
    text += `\nTotal: ${order.total || 0}\nTime: ${new Date(order.ts || Date.now()).toLocaleString()}`;

    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const resp = await axios.post(url, {
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML'
    });

    if (resp && resp.data && resp.data.ok) {
      return res.json({ ok: true, telegram: resp.data });
    }
    return res.status(500).json({ ok: false, telegram: resp.data || null });
  } catch (err) {
    console.error('send-order error:', err && err.message || err);
    return res.status(500).json({ ok: false, error: (err && err.message) || String(err) });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}. POST /api/send-order to forward orders to Telegram.`);
});
