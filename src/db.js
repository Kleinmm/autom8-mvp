import pg from 'pg';

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Supabase requires SSL; this is fine for MVP
});

export async function query(text, params) {
  const result = await pool.query(text, params);
  return result.rows;
}

// Find an existing customer by channel + channel_user_id, or create one.
// This is the one place "channel_user_id capture" from the build sequence doc happens —
// don't skip calling this on every incoming message.
export async function findOrCreateCustomer(channel, channelUserId) {
  const existing = await query(
    'select * from customers where channel = $1 and channel_user_id = $2',
    [channel, channelUserId]
  );

  if (existing.length > 0) {
    await query('update customers set last_seen_at = now() where id = $1', [existing[0].id]);
    return existing[0];
  }

  const created = await query(
    'insert into customers (channel, channel_user_id) values ($1, $2) returning *',
    [channel, channelUserId]
  );
  return created[0];
}

export async function logConversation({ merchantId, customerId, channel, direction, message }) {
  await query(
    `insert into conversations (merchant_id, customer_id, channel, direction, message)
     values ($1, $2, $3, $4, $5)`,
    [merchantId, customerId, channel, direction, message]
  );
}
