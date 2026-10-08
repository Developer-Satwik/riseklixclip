const DEFAULT_REDIRECT_URI = "https://clip.riseklix.com/auth/instagram/callback";
const TOKEN_ENDPOINT = "https://api.instagram.com/oauth/access_token";
const LONG_LIVED_ENDPOINT = "https://graph.instagram.com/access_token";

function getEnv(name, fallback = "") {
  return globalThis.Netlify?.env?.get(name) || process.env[name] || fallback;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function htmlPage(title, message, status = 200) {
  title = escapeHtml(title);
  message = escapeHtml(message);
  return new Response(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <title>${title} | Clip by RiseKlix</title>
    <style>
      body{margin:0;min-height:100vh;display:grid;place-items:center;background:#03050b;color:#fff;font-family:Inter,system-ui,sans-serif}
      main{max-width:620px;padding:36px}
      h1{margin:0 0 14px;font-size:clamp(2.2rem,8vw,5rem);line-height:.9;text-transform:uppercase}
      p{margin:0;color:rgba(255,255,255,.72);font-size:1.05rem;line-height:1.7}
      a{color:#20d8ff;font-weight:800}
    </style>
  </head>
  <body>
    <main>
      <h1>${title}</h1>
      <p>${message}</p>
    </main>
  </body>
</html>`, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

async function postWebhook(payload) {
  const webhookUrl = getEnv("INSTAGRAM_TOKEN_WEBHOOK_URL");
  if (!webhookUrl) {
    throw new Error("INSTAGRAM_TOKEN_WEBHOOK_URL is not configured; token payload cannot be persisted.");
  }

  const headers = { "Content-Type": "application/json" };
  const secret = getEnv("INSTAGRAM_WEBHOOK_SECRET");
  if (secret) headers.Authorization = `Bearer ${secret}`;

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Token webhook failed with ${response.status}`);
  }
}

async function exchangeForLongLivedToken(shortLivedAccessToken, clientSecret) {
  if (getEnv("INSTAGRAM_ENABLE_LONG_LIVED_EXCHANGE") !== "true") return null;

  const url = new URL(LONG_LIVED_ENDPOINT);
  url.searchParams.set("grant_type", "ig_exchange_token");
  url.searchParams.set("client_secret", clientSecret);
  url.searchParams.set("access_token", shortLivedAccessToken);

  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.warn("Long-lived Instagram token exchange failed", payload);
    return null;
  }
  return payload;
}

export default async function instagramCallback(req) {
  if (req.method !== "GET") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET" }
    });
  }

  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state") || "";
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description") || "Instagram authorization was cancelled or failed.";

  if (error) {
    return htmlPage("Instagram not connected", errorDescription, 400);
  }

  if (!code) {
    return htmlPage("Missing code", "Meta did not include an authorization code. Please start the Instagram connection flow again from Discord.", 400);
  }

  const clientId = getEnv("INSTAGRAM_CLIENT_ID") || getEnv("META_APP_ID");
  const clientSecret = getEnv("INSTAGRAM_CLIENT_SECRET") || getEnv("META_APP_SECRET");
  const redirectUri = getEnv("INSTAGRAM_REDIRECT_URI", DEFAULT_REDIRECT_URI);

  if (!clientId || !clientSecret) {
    return htmlPage(
      "Instagram backend not configured",
      "The callback URL is live, but Netlify environment variables INSTAGRAM_CLIENT_ID and INSTAGRAM_CLIENT_SECRET still need to be configured before tokens can be exchanged.",
      501
    );
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
    code
  });

  const tokenResponse = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });

  const tokenPayload = await tokenResponse.json().catch(() => ({}));

  if (!tokenResponse.ok || !tokenPayload.access_token) {
    console.error("Instagram token exchange failed", tokenPayload);
    return htmlPage("Token exchange failed", "Instagram returned an error while connecting the account. Please try again from Discord.", 502);
  }

  const longLivedToken = await exchangeForLongLivedToken(tokenPayload.access_token, clientSecret);
  const payload = {
    event: "instagram.connected",
    provider: "instagram",
    state,
    receivedAt: new Date().toISOString(),
    token: longLivedToken || tokenPayload,
    shortLivedToken: longLivedToken ? tokenPayload : undefined
  };

  try {
    await postWebhook(payload);
  } catch (error) {
    console.error(error);
    return htmlPage("Storage failed", "Instagram authorized the connection, but RiseKlix could not save it. Please contact support in Discord.", 502);
  }

  return htmlPage("Instagram connected", "Your Instagram account connection was received. You can return to Discord; the RiseKlix bot will use the approved token to verify campaign media and public performance insights.");
}

export const config = {
  path: "/auth/instagram/callback"
};
