// AirMesh token server: hands the browser a short-lived Decart client token for the "Live AI" portal filter.
// The real Decart key lives only in the DECART_API_KEY secret. Each token is locked to one model, to the
// AirMesh origin that asked, to new connections for 60 s, and to a 60 s realtime session.
export const ORIGINS = ["https://arvanj.github.io", "http://localhost:8000", "http://localhost:8931"];
export const MODEL = "lucy-restyle-2", SESSION_S = 60;

export default {
  async fetch(req, env) {
    const origin = req.headers.get("Origin") || "";
    const allowed = ORIGINS.includes(origin);
    const cors = { "Access-Control-Allow-Origin": allowed ? origin : ORIGINS[0], "Access-Control-Allow-Methods": "POST, OPTIONS", Vary: "Origin" };
    if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (req.method !== "POST" || !allowed) return Response.json({ error: "forbidden" }, { status: 403, headers: cors });

    // a few tokens a minute per visitor: enough to connect and reconnect, not enough to stream all day
    const { success } = await env.TOKENS_PER_IP.limit({ key: req.headers.get("CF-Connecting-IP") || "unknown" });
    if (!success) return Response.json({ error: "busy, try again in a minute" }, { status: 429, headers: cors });

    const r = await fetch("https://api.decart.ai/v1/client/tokens", {
      method: "POST",
      headers: { "X-API-KEY": env.DECART_API_KEY, "content-type": "application/json" },
      body: JSON.stringify({ expiresIn: 60, allowedModels: [MODEL], allowedOrigins: [origin], constraints: { realtime: { maxSessionDuration: SESSION_S } } }),
    });
    if (!r.ok) return Response.json({ error: "token service error" }, { status: 502, headers: cors }); // never echo Decart's reply: it could carry account details
    const { apiKey, expiresAt } = await r.json();
    return Response.json({ apiKey, expiresAt }, { headers: cors });
  },
};
