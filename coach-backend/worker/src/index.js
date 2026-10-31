// Guided Study coach: a small Cloudflare Worker between the public Guided Study page and the
// Claude API. The API key lives here as a secret (ANTHROPIC_API_KEY) and never reaches the page.
//
// POST /api/coach  { task: "case_brief" | "step_guide" | "check_work", passage, genre, reason,
//                    stepId, partId, notes: { [partId]: text } }
// GET  /api/health
import Anthropic from "@anthropic-ai/sdk";
import PLAYBOOK from "../../playbook.md";
import { STEPS, STEP_GROUPS } from "../../steps.mjs";
import { GENRES } from "../../genres.mjs";

const DEFAULT_MODEL = "claude-sonnet-5-5";
const MAX_NOTE = 4000;      // characters kept per part
const MAX_NOTES_TOTAL = 24000;

// Fixed system prompt: playbook + every part spec + every genre guide. Identical on every
// request, so it is cached after the first call.
const SYSTEM_PROMPT = [
  PLAYBOOK,
  "## Step and part specs",
  STEP_GROUPS.map((g) => {
    const parts = g.parts.map((id, i) => {
      const s = STEPS[id];
      const label = g.lettered ? `${g.n}${"abcde"[i]}` : `${g.n}`;
      return `### Part ${id} (${label}) — ${s.title}\n- goal: ${s.goal}\n- coach: ${s.coach}\n- avoid: ${s.avoid}\n- done: ${s.done}`;
    }).join("\n");
    return `## Step ${g.n} (${g.id}) — ${g.title} [${g.phase}]\n${parts}`;
  }).join("\n\n"),
  "## Genre guides",
  Object.entries(GENRES).map(([k, g]) => `### ${k} — ${g.label}\n- ask: ${g.ask}\n- look: ${g.look}\n- avoid: ${g.avoid}`).join("\n")
].join("\n\n");

const str = { type: "string" };
const strList = { type: "array", items: str };
const obj = (properties) => ({ type: "object", properties, required: Object.keys(properties), additionalProperties: false });

const SCHEMAS = {
  case_brief: obj({
    reference_note: str,          // "" when the reference is clear
    unit_note: str,
    genre: { type: "string", enum: [...Object.keys(GENRES), "unsure"] },
    genre_reason: str,
    case_questions: strList
  }),
  step_guide: obj({
    parts: {
      type: "array",
      items: obj({ id: str, do_now: str, questions: strList, look_for: strList, watch_out: str })
    }
  }),
  check_work: obj({ did_well: str, next_move: str, ready: { type: "boolean" } })
};

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    const url = new URL(request.url);
    if (url.pathname === "/api/health") return json({ ok: true, mock: env.MOCK === "1" }, 200, cors);
    if (url.pathname !== "/api/coach" || request.method !== "POST") return json({ error: "Not found" }, 404, cors);
    if (!cors["Access-Control-Allow-Origin"]) return json({ error: "Origin not allowed" }, 403, cors);

    if (env.LIMITER) {
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const { success } = await env.LIMITER.limit({ key: ip });
      if (!success) return json({ error: "You are going a little fast. Wait a minute and try again." }, 429, cors);
    }

    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid JSON" }, 400, cors); }
    const input = validate(body);
    if (input.error) return json({ error: input.error }, 400, cors);

    if (env.MOCK === "1") return json(mockResult(input), 200, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: "The coach is not configured yet." }, 503, cors);

    try {
      const result = await askClaude(env, input);
      return json(result, 200, cors);
    } catch (err) {
      const status = err instanceof Anthropic.RateLimitError ? 429
        : err instanceof Anthropic.APIError && err.status >= 500 ? 503
        : err instanceof Anthropic.APIConnectionError ? 503
        : 502;
      console.error("coach error", err && err.message);
      return json({ error: status === 429 ? "The coach is busy. Try again in a minute." : "The coach could not answer just now. Try again." }, status, cors);
    }
  }
};

function validate(b) {
  if (!b || typeof b !== "object") return { error: "Missing body" };
  const task = b.task;
  if (!SCHEMAS[task]) return { error: "Unknown task" };
  const passage = String(b.passage || "").trim().slice(0, 120);
  if (!passage) return { error: "Missing passage" };
  const genre = GENRES[b.genre] ? b.genre : "";
  const reason = String(b.reason || "").trim().slice(0, 600);
  const group = STEP_GROUPS.find((g) => g.id === b.stepId);
  if (task === "step_guide" && !group) return { error: "Unknown step" };
  const partId = String(b.partId || "");
  if (task === "check_work" && !STEPS[partId]) return { error: "Unknown part" };
  const notes = {};
  let total = 0;
  const raw = b.notes && typeof b.notes === "object" ? b.notes : {};
  for (const g of STEP_GROUPS) for (const id of g.parts) {
    const t = String(raw[id] || "").trim().slice(0, MAX_NOTE);
    if (t && total + t.length <= MAX_NOTES_TOTAL) { notes[id] = t; total += t.length; }
  }
  return { task, passage, genre, reason, group, partId, notes };
}

function notesBlock(notes, onlyBefore) {
  const lines = [];
  for (const g of STEP_GROUPS) {
    if (onlyBefore && g.n >= onlyBefore) break;
    g.parts.forEach((id, i) => {
      if (!notes[id]) return;
      const label = g.lettered ? `${g.n}${"abcde"[i]}` : `${g.n}`;
      lines.push(`[${label} ${STEPS[id].title}]\n${notes[id]}`);
    });
  }
  return lines.length ? `<reader_notes>\n${lines.join("\n\n")}\n</reader_notes>` : "<reader_notes>(none yet)</reader_notes>";
}

function taskMessage(input) {
  const head = [
    `Passage: ${input.passage}`,
    `Genre: ${input.genre ? `${input.genre} (${GENRES[input.genre].label})` : "not chosen yet"}`,
    input.reason ? `Why the reader chose it: ${input.reason}` : ""
  ].filter(Boolean).join("\n");

  if (input.task === "case_brief") {
    return `${head}\n\nTask: case_brief. The reader has just opened this case.`;
  }
  if (input.task === "step_guide") {
    const g = input.group;
    const parts = g.parts.map((id, i) => `${id}${g.lettered ? ` (${g.n}${"abcde"[i]})` : ""}`).join(", ");
    return `${head}\n\nWhat the reader has written in earlier steps:\n${notesBlock(input.notes, g.n)}\n\nTask: step_guide for Step ${g.n} (${g.title}). Return one entry in "parts" for each of these part ids, in order: ${parts}.`;
  }
  const g = STEP_GROUPS.find((x) => x.parts.includes(input.partId));
  const mine = input.notes[input.partId] || "";
  return `${head}\n\nEarlier notes, for context:\n${notesBlock(input.notes, g.n)}\n\nTask: check_work for part ${input.partId} (${STEPS[input.partId].title}) in Step ${g.n}. The reader's notes for this part:\n<reader_notes>\n${mine || "(empty)"}\n</reader_notes>`;
}

async function askClaude(env, input) {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 2 });
  const response = await client.beta.messages.create({
    model: env.MODEL || DEFAULT_MODEL,
    max_tokens: 8000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    thinking: { type: "adaptive" },
    output_config: { effort: env.EFFORT || "medium", format: { type: "json_schema", schema: SCHEMAS[input.task] } },
    system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
    messages: [{ role: "user", content: taskMessage(input) }]
  });
  if (response.stop_reason === "refusal") throw new Error("refusal");
  const text = response.content.filter((c) => c.type === "text").map((c) => c.text).join("");
  const data = JSON.parse(text);
  if (input.task === "step_guide") {
    // Keep only the requested parts, in order.
    const byId = Object.fromEntries((data.parts || []).map((p) => [p.id, p]));
    data.parts = input.group.parts.map((id) => byId[id]).filter(Boolean);
  }
  return data;
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = String(env.ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean);
  const ok = allowed.includes(origin) || (env.MOCK === "1" && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin));
  const h = { "Access-Control-Allow-Methods": "POST, GET, OPTIONS", "Access-Control-Allow-Headers": "Content-Type", "Vary": "Origin" };
  if (ok) h["Access-Control-Allow-Origin"] = origin;
  return h;
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status, headers: { ...headers, "Content-Type": "application/json" } });
}

// Canned answers for local testing without an API key (MOCK=1).
function mockResult(input) {
  if (input.task === "case_brief") {
    return {
      reference_note: "",
      unit_note: `Sample: check whether ${input.passage} begins and ends with a complete thought.`,
      genre: input.genre || "epistles",
      genre_reason: "Sample reason: it is addressed to a church and argues with connectives.",
      case_questions: ["Sample case question one?", "Sample case question two?", "Sample case question three?"]
    };
  }
  if (input.task === "step_guide") {
    return {
      parts: input.group.parts.map((id) => ({
        id,
        do_now: `Sample guidance for ${STEPS[id].title} in ${input.passage}.`,
        questions: ["Sample question about verse 1?", "Sample question about verse 3?", "Sample question about the repeated word?"],
        look_for: ["Sample cue: the connective at the start of verse 2.", "Sample cue: who is speaking."],
        watch_out: "Sample pitfall for this part."
      }))
    };
  }
  return { did_well: "Sample: you named specific verses.", next_move: "Sample: look again at the connective in verse 2.", ready: (input.notes[input.partId] || "").length > 40 };
}
