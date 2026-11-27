#!/usr/bin/env node
/**
 * Create DigProg catalog in Paddle to match website plans:
 * Simple $49 · Medium $149 · Pro $299 (one-time)
 * + optional annual subscription twin at 10× for yearly billing UI.
 *
 * Usage:
 *   set -a; source .env.local; set +a
 *   node scripts/create-paddle-catalog.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local if present
const envLocal = join(__dirname, "../.env.local");
if (existsSync(envLocal)) {
  for (const line of readFileSync(envLocal, "utf8").split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const API_KEY = process.env.PADDLE_API_KEY;
const ENV = (process.env.PADDLE_ENV || "sandbox").toLowerCase();
const BASE =
  ENV === "live" || ENV === "production"
    ? "https://api.paddle.com"
    : "https://sandbox-api.paddle.com";

if (!API_KEY) {
  console.error("Missing PADDLE_API_KEY");
  process.exit(1);
}

/**
 * Website prices (one-time). Annual = 10× as a yearly option.
 * GB/IE/AU overrides ≈ PPP starting points (adjust in dashboard).
 */
const PLANS = [
  {
    key: "simple",
    name: "DigProg Simple",
    description: "Course videos only — starter access for beginners testing the waters.",
    oneTime: "4900", // $49
    year: "49000", // $490
    featuresNote: "Course videos only, starter study notes, community read-only",
    overrides: {
      oneTime: [
        { country_codes: ["GB"], unit_price: { amount: "3900", currency_code: "GBP" } }, // £39
        { country_codes: ["IE"], unit_price: { amount: "4500", currency_code: "EUR" } }, // €45
        { country_codes: ["AU"], unit_price: { amount: "7500", currency_code: "AUD" } }, // A$75
      ],
      year: [
        { country_codes: ["GB"], unit_price: { amount: "39000", currency_code: "GBP" } },
        { country_codes: ["IE"], unit_price: { amount: "45000", currency_code: "EUR" } },
        { country_codes: ["AU"], unit_price: { amount: "75000", currency_code: "AUD" } },
      ],
    },
    human: {
      oneTime: { USD: "$49", GB: "£39", IE: "€45", AU: "A$75" },
      year: { USD: "$490", GB: "£390", IE: "€450", AU: "A$750" },
    },
  },
  {
    key: "medium",
    name: "DigProg Medium",
    description: "Full self-serve path — videos, roadmap, quizzes, and the PDF guide.",
    oneTime: "14900", // $149
    year: "149000", // $1,490
    featuresNote: "All videos, roadmap, quizzes, PDF guide",
    overrides: {
      oneTime: [
        { country_codes: ["GB"], unit_price: { amount: "11900", currency_code: "GBP" } }, // £119
        { country_codes: ["IE"], unit_price: { amount: "13500", currency_code: "EUR" } }, // €135
        { country_codes: ["AU"], unit_price: { amount: "22500", currency_code: "AUD" } }, // A$225
      ],
      year: [
        { country_codes: ["GB"], unit_price: { amount: "119000", currency_code: "GBP" } },
        { country_codes: ["IE"], unit_price: { amount: "135000", currency_code: "EUR" } },
        { country_codes: ["AU"], unit_price: { amount: "225000", currency_code: "AUD" } },
      ],
    },
    human: {
      oneTime: { USD: "$149", GB: "£119", IE: "€135", AU: "A$225" },
      year: { USD: "$1,490", GB: "£1,190", IE: "€1,350", AU: "A$2,250" },
    },
  },
  {
    key: "pro",
    name: "DigProg Pro",
    description: "Medium plus onboarding that turns your idea into daily assigned tasks.",
    oneTime: "29900", // $299
    year: "299000", // $2,990
    featuresNote: "Everything in Medium + onboarding + daily launch tasks",
    overrides: {
      oneTime: [
        { country_codes: ["GB"], unit_price: { amount: "23900", currency_code: "GBP" } }, // £239
        { country_codes: ["IE"], unit_price: { amount: "26900", currency_code: "EUR" } }, // €269
        { country_codes: ["AU"], unit_price: { amount: "44900", currency_code: "AUD" } }, // A$449
      ],
      year: [
        { country_codes: ["GB"], unit_price: { amount: "239000", currency_code: "GBP" } },
        { country_codes: ["IE"], unit_price: { amount: "269000", currency_code: "EUR" } },
        { country_codes: ["AU"], unit_price: { amount: "449000", currency_code: "AUD" } },
      ],
    },
    human: {
      oneTime: { USD: "$299", GB: "£239", IE: "€269", AU: "A$449" },
      year: { USD: "$2,990", GB: "£2,390", IE: "€2,690", AU: "A$4,490" },
    },
  },
];

async function paddle(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "Paddle-Version": "1",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(`Paddle ${method} ${path} → ${res.status}`);
    err.detail = json;
    throw err;
  }
  return json.data;
}

async function archiveOldWrongCatalog() {
  // Best-effort: archive previous Starter/Pro/Advanced products if catalog exists
  const prevPath = join(__dirname, "../src/data/paddleCatalog.json");
  if (!existsSync(prevPath)) return;
  try {
    const prev = JSON.parse(readFileSync(prevPath, "utf8"));
    for (const p of Object.values(prev.products || {})) {
      const id = p.productId;
      if (!id) continue;
      try {
        await paddle("PATCH", `/products/${id}`, { status: "archived" });
        console.log("Archived old product", id);
      } catch (e) {
        console.warn("Could not archive", id, e.message);
      }
    }
  } catch {
    /* ignore */
  }
}

async function main() {
  console.log(`Paddle env: ${ENV} → ${BASE}\n`);
  await archiveOldWrongCatalog();

  const catalog = {
    createdAt: new Date().toISOString(),
    environment: ENV,
    pricingModel: "website-matched",
    note: "Amounts match DigProg site Simple $49 / Medium $149 / Pro $299 (one-time). Annual = 10× optional.",
    countryOverridesNote: "GB/IE/AU PPP starting points — adjust in Paddle dashboard.",
    overridesHuman: Object.fromEntries(
      PLANS.map((p) => [p.key, p.human]),
    ),
    products: {},
  };

  for (const plan of PLANS) {
    console.log(`Creating product: ${plan.name}`);
    const product = await paddle("POST", "/products", {
      name: plan.name,
      description: plan.description,
      tax_category: "standard",
      type: "standard",
      custom_data: { digprog_plan: plan.key },
    });

    const oneTime = await paddle("POST", "/prices", {
      product_id: product.id,
      description: `${plan.name} · one-time`,
      name: "One-time",
      tax_mode: "account_setting",
      unit_price: { amount: plan.oneTime, currency_code: "USD" },
      unit_price_overrides: plan.overrides.oneTime,
      quantity: { minimum: 1, maximum: 1 },
      custom_data: { digprog_plan: plan.key, digprog_cycle: "one_time" },
    });
    console.log(`  one-time: ${oneTime.id} · USD ${(Number(plan.oneTime) / 100).toFixed(2)}`);

    // Annual recurring option (no free trial forced — website was one-time; keep simple)
    const year = await paddle("POST", "/prices", {
      product_id: product.id,
      description: `${plan.name} · annual`,
      name: "Annual",
      tax_mode: "account_setting",
      billing_cycle: { interval: "year", frequency: 1 },
      unit_price: { amount: plan.year, currency_code: "USD" },
      unit_price_overrides: plan.overrides.year,
      quantity: { minimum: 1, maximum: 1 },
      custom_data: { digprog_plan: plan.key, digprog_cycle: "year" },
    });
    console.log(`  year: ${year.id} · USD ${(Number(plan.year) / 100).toFixed(2)}`);

    catalog.products[plan.key] = {
      productId: product.id,
      name: plan.name,
      prices: {
        oneTime: {
          id: oneTime.id,
          amount: plan.oneTime,
          currency: "USD",
          display: `USD ${(Number(plan.oneTime) / 100).toFixed(2)}`,
          overrides: plan.overrides.oneTime,
        },
        year: {
          id: year.id,
          amount: plan.year,
          currency: "USD",
          display: `USD ${(Number(plan.year) / 100).toFixed(2)}`,
          overrides: plan.overrides.year,
        },
      },
    };
    console.log(`  product: ${product.id}\n`);
  }

  const outJson = join(__dirname, "../src/data/paddleCatalog.json");
  const outMd = join(__dirname, "../PADDLE-CATALOG.md");
  writeFileSync(outJson, JSON.stringify(catalog, null, 2) + "\n");

  const lines = [
    `# DigProg Paddle catalog (${ENV})`,
    ``,
    `Matched to website: **Simple $49 · Medium $149 · Pro $299** (one-time).`,
    `Annual prices = 10× as an optional yearly billing choice.`,
    ``,
    `## Country overrides`,
    ``,
    `| Plan | One-time USD | GB | IE | AU |`,
    `|---|---|---|---|---|`,
  ];
  for (const p of PLANS) {
    const h = p.human.oneTime;
    lines.push(`| ${p.key} | ${h.USD} | ${h.GB} | ${h.IE} | ${h.AU} |`);
  }
  lines.push(``, `## IDs`, ``);
  for (const [key, p] of Object.entries(catalog.products)) {
    lines.push(`### ${p.name} (\`${key}\`)`);
    lines.push(`- Product: \`${p.productId}\``);
    lines.push(`- One-time: \`${p.prices.oneTime.id}\` · ${p.prices.oneTime.display}`);
    lines.push(`- Annual: \`${p.prices.year.id}\` · ${p.prices.year.display}`);
    lines.push(``);
  }
  writeFileSync(outMd, lines.join("\n"));
  console.log("Wrote", outJson);
  console.log("Wrote", outMd);
}

main().catch((e) => {
  console.error(e.message);
  if (e.detail) console.error(JSON.stringify(e.detail, null, 2));
  process.exit(1);
});
