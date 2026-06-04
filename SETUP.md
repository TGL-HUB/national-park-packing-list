# 🔒 Access-code gate — setup & cutover

The app is now private: nobody can see the itinerary without the shared code.
The code is checked **server-side** (`/api/login`), the trip data is served only
to authenticated visitors (`/api/trip`, `/api/list`), and none of it ships in
the public JavaScript bundle.

## How it works
- `index.html` / the React bundle contain **no trip data and no database key**.
- On load, the app calls `GET /api/trip`. If you're not signed in it returns
  `401` and the app shows the **access-code screen**.
- Submitting the code hits `POST /api/login`, which compares it to `ACCESS_CODE`
  and sets a signed, HttpOnly session cookie (valid 30 days).
- All trip data lives server-side (`lib/tripData.js`) and in Supabase, reached
  only through the serverless functions using the **service-role key**.

## One-time setup (you)

### 1. Add environment variables in Vercel
Project → **Settings → Environment Variables**, add for **Production** and
**Preview**:

| Name | Value |
| --- | --- |
| `ACCESS_CODE` | the code you'll give friends (e.g. a memorable word/phrase) |
| `SESSION_SECRET` | a long random string (see `.env.example` for a generator) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API → `service_role` secret |
| `SUPABASE_URL` | (optional) `https://sinjmdlhabgywoavwjkl.supabase.co` |

### 2. Deploy
Merge this branch to `main`. Vercel auto-redeploys production with the gate.
(The functions use the service-role key, so the app keeps working even before
step 3 — the database isn't locked down yet.)

### 3. Lock down the database (final step — do AFTER step 2 is verified)
Until this runs, the table is still publicly readable with the old publishable
key (which is in git history). Run `db/lockdown.sql` against the Supabase
project to remove all public access. After this, the table is reachable only
through the gated `/api` functions.

> ⚠️ Do not run step 3 before production is on the gated build, or the **live**
> app will break mid-trip.

## Notes
- Live cross-device sync now uses polling (refresh on focus + every ~15s)
  instead of Supabase realtime, which can't work once the DB is locked down.
- To change the code later, just edit `ACCESS_CODE` in Vercel and redeploy.
  Existing sessions stay valid for 30 days; rotate `SESSION_SECRET` to force
  everyone to re-enter the code.
