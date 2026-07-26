# EAT — Executive Assistant Tracker

A single-file web app (`EAT.html`) that Sudharsan uses to run meetings, action
items, daily activities, notes, Work SOPs, compliance tracking, MIS reports,
a document Library, and an embedded AI chat assistant ("Sonnet") with full
read/write control over every module.

## Architecture

- **Frontend**: pure HTML/CSS/JS, no build step — `EAT.html` is the entire app.
- **Auth**: Firebase Authentication (email/password), single account.
- **Data sync**: Firebase Realtime Database, scoped to `users/{uid}`.
- **File storage**: Firebase Storage, scoped to `users/{uid}/library/...`.
- **AI**: Claude (Anthropic) calls are proxied through a Firebase Cloud
  Function (`functions/index.js`) so the Anthropic API key lives only on the
  server, never in the browser or in this repo.
- **Hosting**: GitHub Pages (this repo is public and static).

This means the same login works from any device/browser and gets the same
data and the same AI functionality — nothing to configure per-device.

## Setup

See `DEPLOYMENT.md` for the full step-by-step guide covering:
GitHub repo + Pages, Firebase project creation, enabling Blaze billing,
deploying the Cloud Function, setting the Anthropic key as a secret,
creating your Firebase Auth user, and filling in the config placeholders
in `EAT.html`.

## Repo layout

- `EAT.html` — the app itself.
- `functions/` — the Cloud Function that proxies Claude API calls.
- `database.rules.json` — Realtime Database security rules.
- `storage.rules` — Firebase Storage security rules.
- `firebase.json`, `.firebaserc` — Firebase CLI project config.
- `DEPLOYMENT.md` — setup/deployment guide.

## Security notes

- No API keys are stored in this repository. The Anthropic key is set as a
  Firebase Functions secret, never committed.
- Database and Storage rules restrict all reads/writes to the signed-in
  user's own UID.
- There is no public sign-up flow in the app; only a pre-created account can
  sign in.
