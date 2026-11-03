// node worker/test.mjs: checks the token server with a stubbed Decart API and rate limiter
import assert from "node:assert/strict";
import worker, { MODEL, SESSION_S } from "./index.js";

let sent = null, decartOk = true, allow = true;
globalThis.fetch = async (url, init) => { sent = { url, init }; return decartOk ? Response.json({ apiKey: "ek_test", expiresAt: "soon", permissions: { origins: ["x"] } }) : new Response("nope: acct 123", { status: 401 }); };
const env = { DECART_API_KEY: "dk_secret", TOKENS_PER_IP: { limit: async () => ({ success: allow }) } };
const req = (method, origin) => new Request("https://w.dev/", { method, headers: origin ? { Origin: origin } : {} });

let r = await worker.fetch(req("OPTIONS", "https://arvanj.github.io"), env);
assert.equal(r.status, 204);
assert.equal(r.headers.get("Access-Control-Allow-Origin"), "https://arvanj.github.io");

r = await worker.fetch(req("POST", "https://evil.example"), env);
assert.equal(r.status, 403, "unknown origins are refused");
r = await worker.fetch(req("GET", "https://arvanj.github.io"), env);
assert.equal(r.status, 403, "only POST mints tokens");

sent = null;
r = await worker.fetch(req("POST", "https://arvanj.github.io"), env);
assert.equal(r.status, 200);
assert.deepEqual(await r.json(), { apiKey: "ek_test", expiresAt: "soon" }, "only the token goes back to the browser");
assert.equal(sent.url, "https://api.decart.ai/v1/client/tokens");
assert.equal(sent.init.headers["X-API-KEY"], "dk_secret");
const body = JSON.parse(sent.init.body);
assert.deepEqual(body.allowedModels, [MODEL]);
assert.deepEqual(body.allowedOrigins, ["https://arvanj.github.io"]);
assert.equal(body.constraints.realtime.maxSessionDuration, SESSION_S);

allow = false;
r = await worker.fetch(req("POST", "https://arvanj.github.io"), env);
assert.equal(r.status, 429, "rate limited visitors get no token");
allow = true;

decartOk = false;
r = await worker.fetch(req("POST", "https://arvanj.github.io"), env);
assert.equal(r.status, 502);
assert.ok(!(await r.text()).includes("acct"), "Decart's error text is not passed through");

console.log("worker ok");
