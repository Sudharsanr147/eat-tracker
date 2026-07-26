# Changelog

All notable changes to the EAT (Executive Assistant Tracker) app are recorded here.

The version number shown in this file always matches what's displayed inside
the app itself (login screen and sidebar footer) — see `APP_VERSION` near the
top of the `<script>` block in `index.html`. If the number you see in the app
matches the latest entry below, you're on the current version.

## v1.4.0 — 2026-07-26

- Reordered the left sidebar menu: Chat, Daily Activities, Action Items,
  Notes, Calendar, Meetings, Work SOP, Compliance Manager, MIS Reports,
  Library.
- Added an edit (✎) option to Action Items — works for both standalone
  actions and actions linked to a meeting.
- Added an edit (✎) option to Daily Activities — click it to edit the
  activity text in place.
- The AI chat assistant can now edit Daily Activities too (it already could
  edit Action Items) — e.g. "change 'call vendor' to 'call vendor about
  invoice'".

## v1.3.3 — 2026-07-26

- Fixed the real cause of the chat crash: Firebase's database silently
  drops empty lists (like an empty Library file list) when it saves your
  data. After a cloud sync, that could leave a piece of app data missing
  entirely instead of just empty — and the chat assistant crashed instead
  of handling that gracefully. All data loading paths (opening the app,
  syncing from the cloud, restoring a backup) now re-fill any missing
  pieces automatically, so this can't happen again.

## v1.3.2 — 2026-07-26

- Fixed the AI chat assistant crashing with "Cannot read properties of
  undefined (reading 'filter')" on every message. The chat code assumed the
  AI service's response always included a `content` array; when it didn't
  (and wasn't a recognized error shape either), it crashed instead of
  telling you what actually came back. It now shows the raw response in the
  chat instead of crashing, so if this happens again we can see the real
  cause immediately.

## v1.3.1 — 2026-07-26

- Hotfix: the v1.3.0 commit was corrupted in transit (the file got truncated
  partway through, breaking Sign In and everything else on the live site).
  This release just restores the complete, correct file — no functional
  changes beyond v1.3.0's.

## v1.3.0 — 2026-07-26

- Fixed the left sidebar menu items being invisible (but still clickable) on
  phones — sidebar, chat history, and detail pane are now full-viewport
  drawers instead of relying on a fragile measured offset.
- Tables (Meetings, Action Items, Compliance, Library) no longer scroll
  sideways on narrow screens — rows now stack into cards that wrap and
  scroll vertically.
- Calendar day boxes now stack full-width, one below another, with room for
  2–4 lines of preview text, instead of a cramped grid.
- Fixed landscape orientation and tablet/iPad sizes falling through to the
  desktop layout with no visible menu or detail pane — the mobile layout now
  triggers on short height as well as narrow width.
- Added a "☰ Chat History" button so the mobile chat-session drawer (which
  had no way to open it) is now reachable.
- Added this changelog and an in-app version indicator.

## v1.2.0 — 2026-07-26 (`9e68d45`)

- Fixed mobile menu bar and chat input row layout bugs.
- Added a delete-chat option to the web UI.
- Added an audit log for deletions and edits.

## v1.1.1 — 2026-07-26 (`8ff713e`)

- Added a service worker for Android "install to home screen" support.

## v1.1.0 — 2026-07-26 (`5666950`)

- Added Firebase project config and wired up the Cloud Function URL.

## v1.0.1 — 2026-07-26 (`091353b`)

- Renamed `EAT.html` to `index.html`.

## v1.0.0 — 2026-07-26 (`7c19fe0`)

- Initial commit: meetings, action items, daily activities, notes,
  compliance, MIS reports, library, Work SOP, and the embedded AI chat
  assistant, backed by Firebase Auth/Realtime Database/Storage.
