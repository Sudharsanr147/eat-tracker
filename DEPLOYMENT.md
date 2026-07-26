# EAT Deployment Guide

Everything in this folder is ready to go. This guide walks through the parts
only you can do — creating accounts, billing, and pushing code — in order.
Follow it top to bottom the first time; after that you'll only ever repeat
the "push updates" step.

Before you start, delete the stray hidden folder `.git-broken-remove-this`
in this project folder (File Explorer → View → show hidden items). It's a
leftover from a failed git init attempt in the sandbox and isn't needed.

## 1. Create the GitHub repository

1. Go to github.com and sign in (or create an account).
2. Click **New repository**. Name it e.g. `eat-tracker`. Set visibility to
   **Public**. Don't initialize with a README (you already have one here).
3. On your own computer, open a terminal in this folder
   (`Claude as office secretary`) and run:
   ```
   git init
   git add -A
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/eat-tracker.git
   git push -u origin main
   ```
4. In the repo on GitHub: **Settings → Pages** → Source: "Deploy from a
   branch" → Branch: `main`, folder `/ (root)` → Save. GitHub will give you a
   URL like `https://YOUR_USERNAME.github.io/eat-tracker/EAT.html`. That's
   the link you'll open from any device going forward.

## 2. Create the Firebase project

1. Go to console.firebase.google.com → **Add project** → give it a name
   (e.g. `eat-tracker`) → finish the wizard.
2. **Upgrade to the Blaze (pay-as-you-go) plan**: gear icon → Usage and
   billing → Modify plan → Blaze. This is required for Cloud Functions and
   for Storage/Database beyond the free tier. Blaze still has a generous
   free monthly quota — you're only billed for usage above it, and a single
   user chatting with Claude and storing files will cost very little.
3. **Authentication**: left sidebar → Build → Authentication → Get started →
   enable **Email/Password** sign-in method.
   Then go to the **Users** tab → **Add user** → enter your email and a
   password. This is the one and only account the app will accept — there
   is no public sign-up in the app itself.
4. **Realtime Database**: Build → Realtime Database → Create database →
   choose a location → start in **locked mode** (rules get overwritten by
   deploy in step 4 below anyway).
5. **Storage**: Build → Storage → Get started → same idea, locked mode is
   fine.
6. **Register a Web App**: Project Overview (gear icon → Project settings) →
   scroll to "Your apps" → click the `</>` (web) icon → give it a nickname →
   Register app. You'll see a `firebaseConfig` object — keep this tab open,
   you'll need those values in step 5.

## 3. Install the Firebase CLI and connect this project

On your computer, in this folder:
```
npm install -g firebase-tools
firebase login
```
Then edit `.firebaserc` in this folder and replace
`REPLACE_WITH_YOUR_PROJECT_ID` with your actual Firebase project ID (visible
in Project settings — it's not always the same as the display name).

## 4. Deploy the database/storage rules and the Cloud Function

Still in this folder:
```
cd functions
npm install
cd ..
firebase functions:secrets:set ANTHROPIC_API_KEY
```
Paste your real Anthropic API key when prompted (get one at
console.anthropic.com if you don't have one yet). This stores it as a
Google Cloud secret — it is never written to any file in this repo.

Now deploy everything:
```
firebase deploy --only functions,database,storage
```
When it finishes, it prints your function's URL, something like:
```
https://us-central1-eat-tracker-xxxxx.cloudfunctions.net/anthropicProxy
```
Copy that URL.

## 5. Fill in the placeholders in EAT.html

Open `EAT.html` and find the `FB_CONFIG` object and `CLOUD_FN_URL` constant
(near the top of the main `<script>` block, search for `REPLACE_ME`).

Replace `FB_CONFIG` with the `firebaseConfig` values from step 2.6, and set
`CLOUD_FN_URL` to the function URL from step 4. Save the file.

## 6. Push the filled-in config to GitHub

```
git add -A
git commit -m "Add Firebase project config"
git push
```
GitHub Pages will redeploy automatically within a minute or two.

## 7. Test it end to end

1. Open your GitHub Pages URL from step 1.4 on any device.
2. Sign in with the email/password you created in step 2.3.
3. Add a meeting or note, then open the app on a second device/browser and
   confirm the same data shows up (sidebar → Account → Push/Pull, or just
   wait for the auto-sync).
4. Open the chat, ask Sonnet something that requires a tool call (e.g. "add
   a note that says test"), and confirm it responds — this proves the
   Cloud Function → Anthropic path works.
5. Go to Library, upload a small file, and confirm the ⬇ download icon
   appears next to it — this proves Firebase Storage is wired up.

## Ongoing: pushing future edits

Any time EAT.html or the functions code changes:
```
git add -A
git commit -m "describe the change"
git push
```
If only `functions/index.js` changed, also run
`firebase deploy --only functions` to actually update the live function
(GitHub Pages only serves the static frontend — the function has to be
redeployed separately).

## Costs and limits

- **Blaze plan**: no fixed monthly fee — pay only for usage past the free
  tier. For one user, Realtime Database and Storage usage will likely stay
  within or just past the free tier; Cloud Functions invocations for chat
  messages are typically fractions of a cent each.
- **10GB target**: Firebase Storage's free tier is 5GB; Blaze billing is
  roughly $0.026/GB-month beyond that, so 10GB total is on the order of a
  few cents a month beyond the free allowance — check current pricing at
  firebase.google.com/pricing before relying on this estimate, as it can
  change.
- **Anthropic usage**: billed separately via your Anthropic account based on
  tokens used by chat and MIS operations.
