import crypto from "node:crypto";

function getEnv(name, fallback = "") {
  return globalThis.Netlify?.env?.get(name) || process.env[name] || fallback;
}

function base64UrlDecode(value) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(normalized + "=".repeat((4 - normalized.length % 4) % 4), "base64");
}

function parseSignedRequest(signedRequest, appSecret) {
  const [encodedSignature, encodedPayload] = String(signedRequest || "").split(".");
  if (!encodedSignature || !encodedPayload) {
    throw new Error("Invalid signed_request format");
  }

  const payload = JSON.parse(base64UrlDecode(encodedPayload).toString("utf8"));

  if (appSecret) {
    const expected = crypto
      .createHmac("sha256", appSecret)
      .update(encodedPayload)
      .digest();
    const actual = base64UrlDecode(encodedSignature);

    if (actual.length !== expected.length || !crypto.timingSafeEqual(actual, expected)) {
      throw new Error("Invalid signed_request signature");
    }
  }

  return payload;
}

async function readPayload(req) {
  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return req.json();
  }
  const body = await req.text();
  return Object.fromEntries(new URLSearchParams(body));
}

async function postWebhook(payload) {
  const webhookUrl = getEnv("INSTAGRAM_DEAUTHORIZE_WEBHOOK_URL") || getEnv("INSTAGRAM_TOKEN_WEBHOOK_URL");
  if (!webhookUrl) {
    throw new Error("No Instagram deauthorize webhook configured; token removal cannot be persisted.");
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
    throw new Error(`Deauthorize webhook failed with ${response.status}`);
  }
}

export default async function instagramDeauthorize(req) {
  if (req.method === "GET") {
    return new Response("Instagram deauthorize callback is ready.", {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
      }
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET, POST" }
    });
  }

  const appSecret = getEnv("INSTAGRAM_CLIENT_SECRET") || getEnv("META_APP_SECRET");
  if (!appSecret) {
    return new Response("Instagram deauthorize callback is not configured", {
      status: 501,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  const body = await readPayload(req);

  try {
    const signedPayload = parseSignedRequest(body.signed_request, appSecret);
    await postWebhook({
      event: "instagram.deauthorized",
      provider: "instagram",
      receivedAt: new Date().toISOString(),
      payload: signedPayload
    });
  } catch (error) {
    console.error(error);
    const storageFailed = String(error?.message || "").includes("webhook");
    return new Response(storageFailed ? "Deauthorize storage failed" : "Invalid deauthorize request", {
      status: storageFailed ? 502 : 400,
      headers: { "Content-Type": "text/plain; charset=utf-8" }
    });
  }

  return new Response("OK", {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

export const config = {
  path: "/auth/instagram/deauthorize"
};
