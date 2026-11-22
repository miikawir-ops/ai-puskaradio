// Browser check for AI Puskaradio. No dependencies: drives headless Edge (or Chrome)
// over the DevTools Protocol using Node's built-in WebSocket (Node 22+).
//
// CLI:  node tools/browser-check.mjs [target] [outDir]
//   target  directory to serve locally (default: repo root) or an http(s) URL (e.g. the live site)
//   outDir  where screenshots go (default: <os tmp>/puskaradio-check)
//
// For desktop (1280x900) and mobile (390x844), in both skins (neon, asiallinen), on every view:
//   - no JS errors           - no horizontal page overflow
//   - full-page screenshot   - every request stays on the site's own origin (data: URIs allowed)
// and finally that no font face failed to load. Exits 1 if any check fails.
//
// Module use (task-specific checks):  import { withPage } from "./browser-check.mjs";
//   await withPage(target, async (p) => { await p.viewport("mobile"); await p.go("#vinkit"); p.ev("...") });

import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKIN_KEY = "ai-puskaradio-demo-v1-skin";
export const VIEWS = ["vinkit", "tulostaulu", "kysy", "oma", "miten", "johto"];
export const VIEWPORTS = {
  desktop: { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false },
  mobile: { width: 390, height: 844, deviceScaleFactor: 1, mobile: true },
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function findBrowser() {
  const c = [process.env.BROWSER_PATH,
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Google/Chrome/Application/chrome.exe"].filter(Boolean);
  const b = c.find((p) => fs.existsSync(p));
  if (!b) throw new Error("No Edge/Chrome found; set BROWSER_PATH");
  return b;
}

function serve(root) {
  const types = { ".html": "text/html; charset=utf-8", ".woff2": "font/woff2", ".md": "text/markdown; charset=utf-8", ".txt": "text/plain; charset=utf-8" };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    const f = path.join(root, p);
    if (!f.startsWith(root)) { res.writeHead(403); return res.end(); }
    fs.readFile(f, (e, d) => {
      if (e) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "content-type": types[path.extname(f)] || "application/octet-stream" }); res.end(d);
    });
  });
  return new Promise((r) => server.listen(0, "127.0.0.1", () => r(server)));
}

export async function withPage(target, fn) {
  let server = null, url = target;
  if (!/^https?:/.test(target)) { server = await serve(path.resolve(target)); url = "http://127.0.0.1:" + server.address().port + "/"; }
  const origin = new URL(url).origin;
  const prof = fs.mkdtempSync(path.join(os.tmpdir(), "puskaradio-edge-"));
  const br = spawn(findBrowser(), ["--headless=new", "--remote-debugging-port=0", "--user-data-dir=" + prof,
    "--no-first-run", "--no-default-browser-check", "about:blank"], { stdio: "ignore" });
  const state = { errors: [], foreign: [], requests: [] };
  let sock;
  try {
    let port;
    for (let i = 0; i < 80 && !port; i++) { await sleep(150); try { port = fs.readFileSync(path.join(prof, "DevToolsActivePort"), "utf8").split("\n")[0]; } catch {} }
    if (!port) throw new Error("Browser did not start");
    let ws;
    for (let i = 0; i < 40 && !ws; i++) { try { ws = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === "page")?.webSocketDebuggerUrl; } catch {} if (!ws) await sleep(150); }
    sock = new WebSocket(ws);
    await new Promise((r, j) => { sock.onopen = r; sock.onerror = j; });
    let id = 0; const pend = {}; const waiters = [];
    sock.onmessage = (m) => {
      const d = JSON.parse(m.data);
      if (d.id && pend[d.id]) { pend[d.id](d); delete pend[d.id]; return; }
      const p = d.params || {};
      if (d.method === "Network.requestWillBeSent") {
        const u = p.request.url; state.requests.push(u);
        if (!u.startsWith("data:") && new URL(u).origin !== origin) state.foreign.push(u);
      }
      if (d.method === "Runtime.exceptionThrown") state.errors.push(p.exceptionDetails.exception?.description || p.exceptionDetails.text);
      if (d.method === "Runtime.consoleAPICalled" && p.type === "error") state.errors.push("console.error: " + p.args.map((a) => a.value ?? a.description).join(" "));
      waiters.filter((w) => w.method === d.method).forEach((w) => { waiters.splice(waiters.indexOf(w), 1); w.resolve(p); });
    };
    const send = (method, params = {}) => new Promise((r, j) => { const i = ++id; pend[i] = (d) => d.error ? j(new Error(method + ": " + d.error.message)) : r(d.result); sock.send(JSON.stringify({ id: i, method, params })); });
    const once = (method, ms = 15000) => new Promise((resolve, reject) => {
      const w = { method, resolve: (v) => { clearTimeout(t); resolve(v); } }; waiters.push(w);
      const t = setTimeout(() => { waiters.splice(waiters.indexOf(w), 1); reject(new Error("timeout waiting for " + method)); }, ms);
    });
    await Promise.all(["Network.enable", "Page.enable", "Runtime.enable"].map((m) => send(m)));
    await send("Network.setCacheDisabled", { cacheDisabled: true });

    const p = {
      url, origin, state, send,
      async ev(expr) {
        const r = await send("Runtime.evaluate", { expression: expr, awaitPromise: true, returnByValue: true });
        if (r.exceptionDetails) throw new Error("evaluate failed: " + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
        return r.result.value;
      },
      async viewport(name) { await send("Emulation.setDeviceMetricsOverride", VIEWPORTS[name]); },
      // Unique query string: a navigation that only changes the hash would not fire a load event.
      async load(hash = "#vinkit") { const l = once("Page.loadEventFired"); await send("Page.navigate", { url: url + "?load=" + Date.now() + hash }); await l; await p.ev("document.fonts.ready.then(() => true)"); await sleep(300); },
      async go(hash) { await p.ev(`location.hash = ${JSON.stringify(hash)}; window.scrollTo(0, 0); true`); await sleep(400); await p.ev("document.fonts.ready.then(() => true)"); },
      async skin(name) { await p.ev(`(() => { try { localStorage.setItem(${JSON.stringify(SKIN_KEY)}, ${JSON.stringify(name)}); } catch (e) {} return true; })()`); await p.load(); },
      async shot(file, fullPage = true) {
        let params = { format: "png" };
        if (fullPage) {
          const m = await send("Page.getLayoutMetrics"); const s = m.cssContentSize || m.contentSize;
          params = { ...params, captureBeyondViewport: true, clip: { x: 0, y: 0, width: Math.ceil(s.width), height: Math.min(Math.ceil(s.height), 8000), scale: 1 } };
        }
        const r = await send("Page.captureScreenshot", params);
        fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.from(r.data, "base64"));
        return file;
      },
    };
    await p.load();
    return await fn(p);
  } finally {
    try { sock?.send(JSON.stringify({ id: 999999, method: "Browser.close" })); } catch {}
    await Promise.race([new Promise((r) => br.once("exit", r)), sleep(3000)]);
    if (br.exitCode === null) br.kill();
    try { sock?.close(); } catch {}
    server?.close();
    for (let i = 0; i < 10; i++) { try { fs.rmSync(prof, { recursive: true, force: true }); break; } catch { await sleep(300); } }
  }
}

const FONTS_EXPR = `[...document.fonts].filter((f) => f.status !== "unloaded").map((f) => f.family.replace(/"/g, "") + " " + f.weight + " " + f.status)`;

async function main() {
  const target = process.argv[2] || REPO;
  const out = process.argv[3] || path.join(os.tmpdir(), "puskaradio-check");
  const fails = [];
  const fonts = new Set();
  await withPage(target, async (p) => {
    console.log("Target:", p.url);
    for (const vp of Object.keys(VIEWPORTS)) {
      await p.viewport(vp);
      for (const skin of ["neon", "asiallinen"]) {
        await p.skin(skin);
        for (const view of VIEWS) {
          const before = p.state.errors.length;
          await p.go("#" + view);
          const o = await p.ev("({ sw: document.documentElement.scrollWidth, w: window.innerWidth })");
          const file = await p.shot(path.join(out, `${vp}-${skin}-${view}.png`));
          const errs = p.state.errors.slice(before);
          const ok = o.sw <= o.w && !errs.length;
          if (!ok) fails.push(`${vp}/${skin}/${view}`);
          (await p.ev(FONTS_EXPR)).forEach((x) => fonts.add(x));
          console.log(`${ok ? "ok  " : "FAIL"} ${vp.padEnd(7)} ${skin.padEnd(10)} ${view.padEnd(10)} width ${o.sw}/${o.w}${errs.length ? "  errors: " + errs.join("; ") : ""}  ${path.basename(file)}`);
        }
      }
    }
    const bad = [...fonts].filter((f) => f.endsWith("error"));
    console.log("Fonts used:", [...fonts].sort().join(", "));
    if (bad.length) fails.push("fonts failed: " + bad.join(", "));
    const foreign = [...new Set(p.state.foreign)];
    console.log("Requests to other origins:", foreign.length ? foreign.join(", ") : "none");
    if (foreign.length) fails.push("foreign requests");
  });
  console.log("Screenshots:", out);
  console.log(fails.length ? "FAILED: " + fails.join(" | ") : "ALL CHECKS PASSED");
  process.exit(fails.length ? 1 : 0);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(2); });
