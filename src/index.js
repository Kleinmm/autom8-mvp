import 'dotenv/config';
import express from 'express';
import { findOrCreateCustomer, logConversation } from './db.js';
import { sendMessage } from './telegram.js';

const app = express();
app.use(express.json());

// Health check — also what a Render free-tier cold start "wakes up" against.
app.get('/', (req, res) => {
  res.send('Autom8 MVP is running.');
});

// Phase 2: every incoming Telegram message gets captured and stored,
// then gets a placeholder reply. No classification logic yet — that's Phase 3.
app.post('/webhook/telegram', async (req, res) => {
  const update = req.body;
  const message = update.message;

  // Telegram sends other update types too (edited messages, etc.) — ignore anything
  // that isn't a plain text message for now.
  if (!message || !message.text) {
    return res.sendStatus(200);
  }

  const chatId = message.chat.id;
  const channelUserId = String(chatId);
  const text = message.text;

  try {
    const customer = await findOrCreateCustomer('telegram', channelUserId);

    await logConversation({
      merchantId: null, // not known yet at this stage — Phase 3 will resolve which merchant this is for
      customerId: customer.id,
      channel: 'telegram',
      direction: 'in',
      message: text,
    });

    const reply = 'Got it, one sec!';
    await sendMessage(chatId, reply);

    await logConversation({
      merchantId: null,
      customerId: customer.id,
      channel: 'telegram',
      direction: 'out',
      message: reply,
    });

    res.sendStatus(200);
  } catch (err) {
    console.error('Error handling Telegram update:', err);
    // Still return 200 — Telegram will keep retrying otherwise, and we've already
    // logged the error for ourselves to look at.
    res.sendStatus(200);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Autom8 MVP listening on port ${port}`);
});
