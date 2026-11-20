import type { VercelRequest, VercelResponse } from "@vercel/node";
import { neon } from "@neondatabase/serverless";
import { randomBytes, createHash } from "crypto";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

function makeCode() {
  return `EARLY-${randomBytes(3).toString("hex").toUpperCase()}`;
}

function normalizeEmail(raw: unknown) {
  if (typeof raw !== "string") return "";
  return raw.trim().toLowerCase();
}

type Signup = {
  email: string;
  name: string;
  interest: string;
  discount_code: string;
  created_at: string;
};

async function saveWithNeon(
  databaseUrl: string,
  email: string,
  name: string,
  interest: string,
  discountCode: string,
) {
  const sql = neon(databaseUrl);
  const existing = await sql`
    SELECT email, discount_code
    FROM waitlist_signups
    WHERE email = ${email}
    LIMIT 1
  `;
  if (existing.length > 0) {
    return {
      alreadyJoined: true,
      discountCode: String(existing[0].discount_code),
    };
  }
  await sql`
    INSERT INTO waitlist_signups (email, name, interest, discount_code, source)
    VALUES (${email}, ${name || null}, ${interest || null}, ${discountCode}, 'landing')
  `;
  return { alreadyJoined: false, discountCode };
}

async function saveWithGitHub(
  token: string,
  repo: string,
  email: string,
  name: string,
  interest: string,
  discountCode: string,
) {
  const [owner, nameRepo] = repo.split("/");
  if (!owner || !nameRepo) throw new Error("WAITLIST_GITHUB_REPO must be owner/repo");

  const path = "waitlist.jsonl";
  const metaUrl = `https://api.github.com/repos/${owner}/${nameRepo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "digprog-waitlist",
  };

  let sha: string | undefined;
  let lines: string[] = [];
  const getRes = await fetch(metaUrl, { headers });
  if (getRes.status === 200) {
    const body = (await getRes.json()) as { sha: string; content: string; encoding: string };
    sha = body.sha;
    const text = Buffer.from(body.content, "base64").toString("utf8");
    lines = text.split("\n").filter(Boolean);
  } else if (getRes.status !== 404) {
    throw new Error(`GitHub read failed: ${getRes.status}`);
  }

  for (const line of lines) {
    try {
      const row = JSON.parse(line) as Signup;
      if (row.email === email) {
        return { alreadyJoined: true, discountCode: row.discount_code };
      }
    } catch {
      /* skip bad line */
    }
  }

  const row: Signup = {
    email,
    name,
    interest,
    discount_code: discountCode,
    created_at: new Date().toISOString(),
  };
  lines.push(JSON.stringify(row));
  const content = Buffer.from(lines.join("\n") + "\n").toString("base64");

  const putRes = await fetch(metaUrl, {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `waitlist: ${createHash("sha256").update(email).digest("hex").slice(0, 10)}`,
      content,
      sha,
    }),
  });
  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub write failed: ${putRes.status} ${errText}`);
  }
  return { alreadyJoined: false, discountCode };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const email = normalizeEmail(req.body?.email);
  const name = typeof req.body?.name === "string" ? req.body.name.trim().slice(0, 80) : "";
  const interest =
    typeof req.body?.interest === "string" ? req.body.interest.trim().slice(0, 120) : "";

  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: "Enter a valid email." });
  }

  const discountCode = makeCode();
  const databaseUrl = process.env.DATABASE_URL;
  const ghToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  const ghRepo = process.env.WAITLIST_GITHUB_REPO;

  try {
    let result: { alreadyJoined: boolean; discountCode: string };

    if (databaseUrl) {
      result = await saveWithNeon(databaseUrl, email, name, interest, discountCode);
    } else if (ghToken && ghRepo) {
      result = await saveWithGitHub(ghToken, ghRepo, email, name, interest, discountCode);
    } else {
      return res.status(503).json({
        error: "Waitlist storage is not configured (DATABASE_URL or WAITLIST_GITHUB_REPO).",
      });
    }

    return res.status(result.alreadyJoined ? 200 : 201).json({
      ok: true,
      alreadyJoined: result.alreadyJoined,
      discountCode: result.discountCode,
      discountPercent: 30,
      message: result.alreadyJoined
        ? "You're already on the waitlist. Your early-bird code is ready."
        : "You're on the DigProg waitlist. Save your 30% early-bird code.",
    });
  } catch (err) {
    console.error("WAITLIST_ERROR", err);
    return res.status(500).json({ error: "Could not save your spot. Try again in a moment." });
  }
}
