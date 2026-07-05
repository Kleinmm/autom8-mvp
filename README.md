# Autom8 MVP — starter code

This covers Phase 0 (foundation) and Phase 2 (message ingestion) from the build sequence doc.
Every step below costs $0.

## 1. Create your Telegram bot

1. Open Telegram, message **@BotFather**.
2. Send `/newbot`, follow the prompts, pick a name and username.
3. BotFather gives you a token like `123456:ABC-DEF...`. Save it — you'll need it below.

## 2. Create your database

1. Go to [supabase.com](https://supabase.com), create a free project.
2. Open the SQL editor, paste in the contents of `sql/schema.sql`, run it.
3. Go to Project Settings → Database → Connection string (URI). Copy it — you'll need it below.

## 3. Configure locally

```
cp .env.example .env
```

Fill in `.env` with your bot token and database URL from steps 1-2.

## 4. Install and run

```
npm install
npm start
```

You should see `Autom8 MVP listening on port 3000`.

## 5. Deploy

Push this to a GitHub repo, then connect it to [Render](https://render.com) as a free web service
(no credit card needed). Set the same environment variables (`TELEGRAM_BOT_TOKEN`, `DATABASE_URL`)
in Render's dashboard rather than committing your `.env` file.

Render will give you a public URL like `https://your-app.onrender.com`.

## 6. Point Telegram at your deployed webhook

Run this once, locally, after deploying (replace with your real URL):

```
node src/telegram.js https://your-app.onrender.com/webhook/telegram
```

You should see a `"ok":true` response.

## 7. Test it

Message your bot on Telegram. You should get "Got it, one sec!" back within a couple seconds
(or up to ~40 seconds if Render's free tier was asleep — that's the cold-start tradeoff from
the cost breakdown, not a bug).

Check Supabase's table editor — you should see rows in both `customers` and `conversations`.

That's Phase 2's exit criteria met: a message in, captured, stored, replied to.

## What's deliberately not here yet

- No classification logic (Phase 3) — every message gets the same placeholder reply.
- No payment, delivery, or dashboard (Phases 4-6).
- No AI (Phase 7) — and no API cost until you build it.

See the full build sequence doc for what comes next.
