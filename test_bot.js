const BOT_TOKEN = "8521051511:AAGqsWjQ82kecjN6reYPZ3-x3WUGXEb6jlc";
const CHAT_IDS = ["8283401187"];

const order = { id: 'ord_123', name: 'Test', phone: '+998901234567', items: {}, total: 10000 };

let text = `<b>📦 Yangi buyurtma!</b>\n\n`;
text += `🆔 <b>ID:</b> ${order.id || 'n/a'}\n`;
text += `👤 <b>Mijoz:</b> ${order.name}\n`;
text += `📞 <b>Telefon:</b> ${order.phone}\n`;

const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

Promise.all(CHAT_IDS.map(chatId => {
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML'
        })
    }).then(res => res.json())
        .then(console.log);
}));
