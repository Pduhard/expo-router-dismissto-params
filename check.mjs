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
const url = () => new URL(page.url()).pathname;
const press = async (text) => {
  await page.getByText(text, { exact: true }).filter({ visible: true }).click({ timeout: 5000 });
  await page.waitForTimeout(500);
};

await page.goto(origin);
await press("open project a");
await press("open drop 1");
await press("open drop 2 of project b");
console.log("history before dismissTo: /, /projects/a/drops, /projects/a/drops/1, /projects/b/drops/2");

const rows = [];
async function row(step, expected, text) {
  const actual = await press(text).then(url, () => `no "${text}" button on ${url()}`);
  rows.push({ step, expected, actual, ok: actual === expected ? "✓" : "✗" });
}

await row("router.dismissTo('/projects/b/drops')", "/projects/b/drops", "dismissTo /projects/b/drops");
await row("router.back()", "/projects/a/drops/1", "router.back()");
await row("router.back()", "/projects/a/drops", "router.back()");

console.table(rows);
await browser.close();
server.close();
process.exitCode = rows.every((r) => r.ok === "✓") ? 0 : 1;
