import { chromium, devices } from "playwright";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const BASE = process.env.BASE_URL || "http://127.0.0.1:5173";
const OUT = join(process.cwd(), "test-results/l001");
mkdirSync(OUT, { recursive: true });

const results = [];

async function check(name, fn) {
  try {
    await fn();
    results.push({ name, ok: true });
    console.log("PASS", name);
  } catch (e) {
    results.push({ name, ok: false, error: String(e?.message || e) });
    console.log("FAIL", name, e?.message || e);
  }
}

const browser = await chromium.launch({ headless: true });

await check("desktop lesson loads video", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/app/classroom`, { waitUntil: "networkidle" });
  const title = page.locator(".l01-header h1");
  await title.waitFor();
  const text = await title.innerText();
  if (!text.includes("What a business is")) throw new Error(`bad title: ${text}`);
  const video = page.locator("video.l01-video");
  await video.waitFor({ state: "visible" });
  const ready = await video.evaluate((v) => v.readyState);
  if (ready < 1) throw new Error(`video readyState ${ready}`);
  await page.screenshot({ path: join(OUT, "desktop.png"), fullPage: true });
  await page.close();
});

await check("transcript seek updates time", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/app/classroom`, { waitUntil: "networkidle" });
  await page.locator(".l01-cue", { hasText: "Interest vs payment" }).click();
  await page.waitForTimeout(200);
  await page.locator(".l01-cue", { hasText: "0:10" }).click();
  await page.waitForTimeout(400);
  const t = await page.locator("video.l01-video").evaluate((v) => v.currentTime);
  if (t < 10 || t > 12) throw new Error(`seek landed at ${t}`);
  await page.close();
});

await check("quiz feedback only after submit", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/app/classroom`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Start practice" }).click();
  await page.locator(".l01-question h3").waitFor();
  if (await page.locator(".l01-feedback").count()) throw new Error("feedback too early");
  await page.locator('.l01-question input[value="b"]').check();
  await page.getByRole("button", { name: "Submit answer" }).click();
  await page.locator(".l01-feedback.ok").waitFor();
  await page.screenshot({ path: join(OUT, "quiz.png") });
  await page.close();
});

await check("mobile layout no horizontal overflow", async () => {
  const iPhone = devices["iPhone 12"];
  const page = await browser.newPage({ ...iPhone });
  await page.goto(`${BASE}/app/classroom`, { waitUntil: "networkidle" });
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2,
  );
  if (overflow) throw new Error("horizontal overflow");
  await page.screenshot({ path: join(OUT, "mobile.png"), fullPage: true });
  await page.close();
});

await check("tablet width ok", async () => {
  const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
  await page.goto(`${BASE}/app/classroom`, { waitUntil: "networkidle" });
  await page.locator("video.l01-video").waitFor();
  await page.screenshot({ path: join(OUT, "tablet.png"), fullPage: true });
  await page.close();
});

await check("keyboard focusable play control", async () => {
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  await page.goto(`${BASE}/app/classroom`, { waitUntil: "networkidle" });
  await page.locator(".l01-controls").getByRole("button", { name: "Play" }).focus();
  const focused = await page.evaluate(() =>
    document.activeElement?.getAttribute("aria-label")?.includes("Play"),
  );
  if (!focused) throw new Error("play not focused");
  await page.close();
});

await browser.close();

const failed = results.filter((r) => !r.ok);
writeFileSync(join(OUT, "report.json"), JSON.stringify(results, null, 2));
console.log(`\n${results.length - failed.length}/${results.length} passed`);
process.exit(failed.length ? 1 : 0);
