# Changelog

All notable changes to the EAT (Executive Assistant Tracker) app are recorded here.

The version number shown in this file always matches what's displayed inside
the app itself (login screen and sidebar footer) — see `APP_VERSION` near the
top of the `<script>` block in `index.html`. If the number you see in the app
matches the latest entry below, you're on the current version.

## v1.9.6 — 2026-08-02

- Daily Activities "Due & Overdue Action Items" table: matched the same
  format change made to the Action Items table — removed the Company
  column and the always-visible icon column, clamped action text to 1-2
  lines, and switched to click-to-reveal row icons (single click reveals
  edit/complete, double-click opens the edit popup).

## v1.9.5 — 2026-08-02

- Action Items table: removed the Company column and the always-visible
  edit/complete/delete icon column. The action text now clamps to 1-2
  lines instead of wrapping freely. Click a row once to reveal that row's
  edit/complete/delete icons (click again to hide them); double-click a
  row to jump straight to the edit popup.

## v1.9.4 — 2026-08-02

- Daily Activities "Due & Overdue Action Items" table: removed the Linked
  To column.
- Both this table and the Action Items table: widened the Status column
  and narrowed the trailing icon-buttons column so the row-action icons
  aren't stranded in a wide empty cell.

## v1.9.3 — 2026-08-02

- Action Items table: removed the Description column — it was crowding the
  table for the (usually empty) common case. A 📝 icon now appears next to
  the action text when a description exists; hover for a preview or click
  it (or ✎) to open the full text in the edit modal.
- Daily Activities "Due & Overdue Action Items" table: brought its columns
  in line with the main Action Items table — added Company, Date Added,
  and Status, renamed Owner to Team Member, and added the same 📝
  description indicator. Linked To (meeting vs. standalone) is kept since
  it's specific to this view.

## v1.9.2 — 2026-08-02

- Fixed chat replying "Something went wrong: Cannot read properties of
  undefined (reading 'map')" on every message, right after the v1.9.1 fix
  let typing/sending work again. Root cause: the same Firebase-drops-empty-
  arrays bug (v1.3.3, v1.9.1), this time hitting Work SOP categories/
  subcategories with no children — `normalizeState()`'s SOP migration only
  defaulted `subcategories`/`practices` to `[]` for local iteration and
  never wrote that empty array back onto the object, so a category/
  subcategory that synced with no children lost the field entirely.
  `buildStateSummary()` (built fresh for every chat turn) then called
  `.map()` on that missing field and threw before the AI request was even
  sent. `normalizeState()` now actually assigns `cat.subcategories=[]` /
  `sub.practices=[]` when missing, not just a local default.

## v1.9.1 — 2026-08-02

- Fixed the chat box appearing completely dead (couldn't type or send) —
  console showed `Cannot read properties of undefined (reading 'length'/
  'push')` in `renderChatMessages`/`addChatMsgToSession`. Root cause:
  Firebase silently drops empty arrays on save (the same class of bug
  fixed in v1.3.3), so a brand-new chat's `messages: []` was dropped on
  sync, and reloading (or a cloud pull) brought the session back with no
  `messages` field at all. `normalizeState()` now re-fills a missing
  `messages` array on every chat session, same as it already does for
  every other collection.

## v1.9.0 — 2026-08-02

- Action Items reworked: the "Owner" column is gone from the table and
  replaced with a clickable Team Member filter-chip bar above the list
  (plus an "All Team Members" chip and a "Clear" chip once a member is
  selected) — the underlying assignment field is unchanged (still a Team
  Member picker in the Add/Edit modal), it's just no longer a plain table
  column. Clicking a member's name filters the list to their actions.
- The confusing "Linked To" column is replaced with an optional Company
  field, selectable from a dropdown sourced from the Company Master (same
  pattern used elsewhere in the app); leaving it blank is fine.
- Added an optional Description field/column (for longer context, e.g. a
  full pasted email) and a Date Added column, both on the Add/Edit Action
  Item modal and the Action Items table. Existing due-date sorting is
  unchanged.
- The Daily Activities "Today Due & Overdue Action Items" sub-table now
  shows a Priority column and an Edit (✎) button, matching the main
  Action Items table.
- EATER (the AI chat assistant) can now set/read an action item's Company
  and Description via chat — including auto-creating a new Company Master
  entry if you name one that doesn't exist yet. When you paste or forward
  an email and ask EATER to log it as an action item, it now files the
  full email content into the Description field and writes a short,
  clear heading as the action text instead of dumping the whole email
  into the title.
- Fixed the chat Send button sitting too close to the bottom edge on
  iPad Chrome, making it hard to tap reliably — the page now opts into
  `viewport-fit=cover` and pads the chat input row by the device's safe
  area inset, so the Send button clears the home-indicator/gesture-bar
  zone in both portrait and landscape.

## v1.8.0 — 2026-08-02

- Sidebar reorganized: module buttons now have proper button styling
  (border, hover/active highlight) with emoji icons removed; the version
  indicator moved up into the header next to the EAT logo, shown in
  brackets. "Views" (the old sub-filter list) is now a collapsible section,
  collapsed by default, and its old "By Owner"/"By Counterparty" sub-groupings
  were removed as no longer needed.
- Added a "Masters" collapsible section (collapsed by default) holding
  Companies and a brand-new Team Members module — Team Members is a full
  add/edit/delete master list (same pattern as Companies) backed by the
  existing participant data, replacing the old "Manage Participants" button.
  It does not change the meeting attendee "Participants" field, which still
  works exactly as before.
- Added a "Settings" collapsible section (collapsed by default, pinned to
  the bottom of the sidebar) holding Audit Log, Cloud Sync, Export/Import,
  and Account.
- Removed the Counterparty field from Meetings entirely — modal, table,
  detail pane, sidebar filters, and the AI chat tools no longer reference it.
- Renamed the Meetings module to "Meeting Minutes" throughout the sidebar
  and toolbar, added a Notes preview column to the Meetings table, and made
  the detail side-panel scroll independently of its header so long meeting
  notes/action lists no longer get cut off.
- Action Items gained a High/Medium/Low priority field, shown as
  color-coded text (red/gold/green in dark mode, red/amber/green in light
  mode) and settable from both the UI and the AI chat assistant.
- Daily Activities gained the same priority field (with sorting: not-done
  items first, then High → Medium → Low → no priority), plus a new
  "Today Due & Overdue Action Items" table beneath the list so overdue or
  due-today action items are visible without leaving the Daily Activities
  screen. Existing/legacy daily items can have a priority added via the
  edit UI. Chat tools (add_daily/edit_daily) support priority too.
- Rewrote EATER's system prompt to clearly explain what each module is for
  (Meeting Minutes, Action Items, Daily Activities, Notes, Calendar, Work
  SOP, Company Master/Team Members, Compliance Manager, MIS Reports,
  Library), and added cross-posting guidance: when a meeting note, general
  note, or Work SOP entry describes something actionable, EATER now asks
  whether it should also be logged as an Action Item or Daily Activity
  instead of silently filing it in one place only.
- Fixed a mobile Safari bug (most visible on iPad) where the chat text
  input bar could render off-screen and unreachable when entering the Chat
  module or tapping the floating message button from another tab — caused
  by the page using `100vh` for its overall height, which on Safari can be
  taller than the actually-visible viewport. The page height now falls back
  to `100dvh` (dynamic viewport height), matching the pattern already used
  for the mobile sidebar and other full-screen drawers.

## v1.7.1 — 2026-08-02

- Fixed the Library category "folders" at the top of the Library view —
  they were already clickable (they've always filtered the file list to
  that category) but had no styling at all, so they looked like plain text
  with no way to tell they were buttons. They now render as proper chips
  with a pointer cursor, hover highlight, and a filled highlight on
  whichever category is currently selected.

## v1.7.0 — 2026-08-02

- Work SOP restructured: categories can now belong to an optional Area
  (grouped header above the category list), the "Practice" level is renamed
  "Detail" throughout, and the separate "Issue" nesting level is gone —
  replaced with a Type dropdown (Info / Issue) directly on each Detail. Info
  entries display in green, Issue entries in red.
- Each Work SOP Detail can now be tagged to one or more companies via a new
  checkbox multi-select; leaving it blank applies the Detail to All
  Companies.
- Added a Company Master ("Companies" in the sidebar), seeded with an
  uneditable, undeletable "All Companies" entry — add/edit/delete your own
  companies here, and they're usable across the portal (currently: tagging
  Work SOP Details).
- Added an optional four-way filter bar (Area, Category, Subcategory,
  Company) at the top of Work SOP — any combination can be left blank.
- Action Items with status Done are now hidden by default; a "Show Done
  items" toggle above the list reveals them.
- The AI chat assistant is now named EATER throughout the app (was
  "Sonnet"). It understands the new Work SOP shape, can create/edit/delete
  Details (with type and company tagging) and manage the Company Master,
  and will auto-file requests like Add info "XXX" or Add issue "XXX" into
  the best-matching Area/Category/Subcategory — defaulting to All Companies
  when no company is named.

## v1.6.0 — 2026-08-01

- The AI chat assistant can now search the public internet (Anthropic's
  native web search tool), but only reaches for it when the answer genuinely
  isn't in your portal data, this chat, or the Library — it won't use it for
  anything your own data can already answer. Any time it does use the web,
  the app automatically appends a clearly labeled "🌐 FROM THE INTERNET"
  source list under that reply, so internet-sourced facts are never
  mistaken for portal data.
- create_powerpoint_presentation now builds real, designed decks instead of
  plain title+bullets slides: 6 slide layouts (title, bullets, two-column,
  section divider, quote, table), 5 color themes (default, corporate-blue,
  dark, warm, minimal-mono), and per-line bold/italic/color formatting on
  bullets. (No image support — decks are text/table/chart-style only.)
- The chat window now shows a live "Thinking… /  Running <tool>… Ns" status
  indicator with an elapsed-seconds counter while waiting on a reply, so
  longer requests (multi-step tool use, document generation) no longer look
  stalled — mirrors the status indicator shown in Claude Cowork.
- create_powerpoint_presentation gained two more slide layouts: chart (real
  native PowerPoint charts — bar, line, pie, doughnut, area, scatter, radar)
  and diagram (process flows, cycles, pyramids, and simple hierarchies built
  from shapes — a SmartArt-style emulation, since true Office SmartArt is a
  proprietary format no library can generate).

## v1.5.0 — 2026-07-31

- The AI chat assistant can now generate real Microsoft Office files on
  request — Word documents (create_word_document), Excel workbooks with one
  or more sheets (create_excel_workbook), and PowerPoint decks
  (create_powerpoint_presentation). Ask for a report, memo, letter, data
  model, tracker, or slide deck and it produces an actual .docx/.xlsx/.pptx
  file, using the app's own data (meetings, actions, compliance, notes,
  etc.) or the chat conversation as source content.
- Every generated file is both downloaded immediately to your device and
  filed into the Library (in a category you choose, or a new "Generated
  Documents" category by default), so it's available later from any device
  you're signed into — same as a file you upload manually.
- Added two new client-side libraries, loaded on demand (deferred, so they
  don't slow down initial page load): `docx` for Word generation and
  `pptxgenjs` for PowerPoint generation. Excel generation reuses the
  existing SheetJS library already used for reading spreadsheets.

## v1.4.1 — 2026-07-26

- Fixed the real cause of the mobile "cut off" text on Action Items and
  other table views: a CSS specificity bug meant a mobile-only rule meant
  to shrink tables to fit the screen was silently losing to a desktop rule
  that forced a 640px minimum width. Tables now correctly narrow to fit the
  phone screen instead of overflowing off the right edge.
- Deferred the xlsx/PDF/Word-document parsing libraries (previously all
  loaded synchronously before the page could render) so the app paints
  faster on mobile connections. No user-facing behavior changed — these
  libraries are only used when you upload a file.
- Desktop layout and behavior are unchanged in this release — every change
  above is scoped to the existing mobile-only CSS or is load-timing only.

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
