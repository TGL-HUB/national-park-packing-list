# 🏔️ Rainier & Olympic Packing List — Claude Code Handoff

## What this is
A single-page React (Vite) app: an interactive packing checklist for a weekend
group hiking trip to Mount Rainier & Olympic National Parks (Seattle base).
Tap-to-check items across 5 categories with a live progress bar.

It was built in a Claude chat session. The goal now: **get it deployed to Vercel
and produce a shareable URL for the trip group.**

## Current status
- ✅ App is fully built and works (`npm run dev` → confirmed, `npm run build` → clean)
- ✅ Vercel account/team exists: **TGL Labs** (`team_x2ruxlKZ2ZIu9e2RBzMHgO6P`, slug `tgl-hubs-projects`)
- ❌ NOT yet deployed
- ❌ NOT yet in a GitHub repo

## Why this got handed off
The chat-based Claude couldn't complete the deploy because:
- Its Vercel connector is read/management only (can list projects/deployments, can't push files)
- The Vercel CLI in that sandbox had no auth token
- GitHub was connected only as a *Notion search source*, not as a write-capable connector

Claude Code runs on the user's machine with real credentials, so it can finish this.

---

## ✅ Your tasks (Claude Code)

### Task 1 — Create a GitHub repo and push
```bash
cd rainier-checklist
git init
git add .
git commit -m "Rainier & Olympic packing checklist"
gh repo create rainier-checklist --public --source=. --remote=origin --push
```
(Requires `gh` CLI authenticated. If not installed: https://cli.github.com/ ,
then `gh auth login`. Or create the repo manually on github.com and push.)

### Task 2 — Deploy to Vercel
```bash
npm install -g vercel   # if not installed
vercel login            # authenticate
vercel link --yes --scope tgl-hubs-projects   # link to TGL Labs team
vercel --prod --yes     # production deploy
```
Vercel auto-detects Vite (build: `vite build`, output: `dist`). No extra config needed.

### Task 3 — Hand back the live URL
After `vercel --prod` finishes it prints a Production URL
(e.g. `https://rainier-checklist.vercel.app`). Give that to the user to share
with their group.

### Optional — connect GitHub↔Vercel for auto-deploy
In the Vercel dashboard, import the GitHub repo so every `git push` redeploys.
Nice-to-have, not required for the trip.

---

## Project structure
```
rainier-checklist/
├── index.html
├── package.json
├── vite.config.js
├── .gitignore
└── src/
    ├── main.jsx              # React entry point
    └── HikingChecklist.jsx   # the whole app (one component)
```

## Stack
- React 18 + Vite 5
- No external UI libs — all inline styles, single component
- All state is in-memory (useState). No backend, no persistence.

## Possible future enhancements (if the user asks)
- Persist checked items to localStorage so progress survives refresh
- Add per-person columns so each friend tracks their own packing
- "Share my progress" via URL query param
- PWA manifest so it installs to phone home screen for offline trail use
