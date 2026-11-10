import { readFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join } from "node:path";
import { chromium } from "playwright";

const TYPES = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json" };

const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  const file = extname(path) ? join("dist", path) : join("dist", "index.html");
  try {
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage();
const pathname = () => new URL(page.url()).pathname;

async function call(title) {
  const before = pathname();
  await page.getByRole("button", { name: title, exact: true }).filter({ visible: true }).click();
  await page.waitForFunction((previous) => location.pathname !== previous, before);
  return pathname();
}

await page.goto(origin);
await call("router.push('/1')");
await call("router.push('/modal')");

const rows = [
  { call: "router.dismissTo('/2')", expected: "/2", actual: await call("router.dismissTo('/2')") },
  { call: "router.back()", expected: "/1", actual: await call("router.back()") },
].map((row) => ({ ...row, ok: row.actual === row.expected ? "✓" : "✗" }));

console.table(rows);
await browser.close();
server.close();
process.exitCode = rows.every((row) => row.ok === "✓") ? 0 : 1;
