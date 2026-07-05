const TELEGRAM_API = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export async function sendMessage(chatId, text) {
  const res = await fetch(`${TELEGRAM_API}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('Telegram sendMessage failed:', res.status, body);
  }
}

// Call this once, manually, after deploying — points Telegram at your webhook.
// Usage: node src/telegram.js https://your-app.onrender.com/webhook/telegram
export async function setWebhook(url) {
  const res = await fetch(`${TELEGRAM_API}/setWebhook`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url }),
  });
  const body = await res.json();
  console.log('setWebhook response:', body);
}

// Allow running this file directly: node src/telegram.js <webhook-url>
if (process.argv[2]) {
  setWebhook(process.argv[2]);
}
