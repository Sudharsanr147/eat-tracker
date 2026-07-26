/**
 * Firebase Cloud Function: anthropicProxy
 * ----------------------------------------
 * Proxies requests from the EAT app to the Anthropic Messages API so that
 * the Anthropic API key never has to live in the browser or in the GitHub
 * repo. The client sends its Firebase ID token in the Authorization header;
 * this function verifies it, then forwards the request body as-is to
 * https://api.anthropic.com/v1/messages using a server-side secret key.
 *
 * Deploy with:
 *   firebase deploy --only functions
 *
 * Set the secret once with:
 *   firebase functions:secrets:set ANTHROPIC_API_KEY
 */

const { onRequest } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

admin.initializeApp();

const ANTHROPIC_API_KEY = defineSecret("ANTHROPIC_API_KEY");

exports.anthropicProxy = onRequest(
  {
    secrets: [ANTHROPIC_API_KEY],
    cors: true,
    region: "us-central1",
    memory: "256MiB",
    timeoutSeconds: 120,
  },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: { message: "Method not allowed" } });
      return;
    }

    // --- 1. Verify the caller is a signed-in Firebase user ---
    const authHeader = req.get("Authorization") || "";
    const match = authHeader.match(/^Bearer (.+)$/);
    if (!match) {
      res.status(401).json({ error: { message: "Missing bearer token" } });
      return;
    }

    let decoded;
    try {
      decoded = await admin.auth().verifyIdToken(match[1]);
    } catch (err) {
      logger.warn("Token verification failed", err);
      res.status(401).json({ error: { message: "Invalid or expired token" } });
      return;
    }

    // Optional extra lockdown: only allow Sudharsan's own account to use
    // this function, even if someone else somehow got a valid Firebase
    // token for a different project. Uncomment and set your UID once you
    // know it (Firebase Console -> Authentication -> Users).
    // const ALLOWED_UID = "REPLACE_WITH_YOUR_UID";
    // if (decoded.uid !== ALLOWED_UID) {
    //   res.status(403).json({ error: { message: "Forbidden" } });
    //   return;
    // }

    // --- 2. Forward the request body to Anthropic ---
    try {
      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY.value(),
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(req.body),
      });

      const data = await anthropicRes.json();
      res.status(anthropicRes.status).json(data);
    } catch (err) {
      logger.error("Anthropic call failed", err);
      res.status(502).json({ error: { message: "Upstream request failed: " + err.message } });
    }
  }
);
