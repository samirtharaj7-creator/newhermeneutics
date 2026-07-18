import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const errors = [];
const unifiedVersion = "a11y-labels-1";
const tailwindRuntimeVersion = "self-hosted-warning-sanitized-1";
const sanitizerMarker = "void 0/*mbe:self-hosted-tailwind-runtime*/;";
const warningFragment = "cdn.tailwindcss.com should not be used in production";
const expectedFields = [
  ["Select a Book", "select"],
  ["Bible Reference", "input"],
  ["Manual Genre Override", "select"],
  ["Optional Notes or Initial Observations", "textarea"]
];

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory() && entry.name !== ".git") return walk(absolutePath);
    return entry.isFile() ? [absolutePath] : [];
  });
}

const runtime = readFileSync(path.join(root, "vendor", "tailwind.js"), "utf8");
if (runtime.includes(warningFragment)) errors.push("vendor/tailwind.js still contains the misleading production warning");
if (runtime.split(sanitizerMarker).length - 1 !== 1) errors.push("vendor/tailwind.js must contain exactly one sanitizer marker");

const unified = readFileSync(path.join(root, "mbe-unified.js"), "utf8");
for (const [label, selector] of expectedFields) {
  if (!unified.includes(`{ label: "${label}", selector: "${selector}" }`)) {
    errors.push(`mbe-unified.js is missing the ${label} accessibility mapping`);
  }
}
for (const requiredFragment of [
  "label.nextElementSibling",
  "control.matches(field.selector)",
  "control.setAttribute('aria-label', field.label)",
  "new MutationObserver",
  "{ childList: true, subtree: true }"
]) {
  if (!unified.includes(requiredFragment)) errors.push(`mbe-unified.js is missing dynamic-label behavior: ${requiredFragment}`);
}

const appBundles = readdirSync(path.join(root, "assets"))
  .filter((name) => /^index-[a-z0-9]+\.js$/i.test(name));
if (appBundles.length !== 1) {
  errors.push(`Expected one application bundle, found ${appBundles.length}`);
} else {
  const bundle = readFileSync(path.join(root, "assets", appBundles[0]), "utf8");
  for (const [label, selector] of expectedFields) {
    const labelIndex = bundle.indexOf(`children:"${label}"`);
    const nearbyMarkup = labelIndex < 0 ? "" : bundle.slice(labelIndex, labelIndex + 900);
    const rendersExpectedControl = new RegExp(`e\\.jsx(?:s)?\\(\"${selector}\"`).test(nearbyMarkup);
    if (labelIndex < 0 || !rendersExpectedControl) {
      errors.push(`Application bundle no longer renders ${label} next to a ${selector} control`);
    }
  }
}

const htmlFiles = walk(root).filter((file) => file.endsWith(".html"));
for (const file of htmlFiles) {
  const html = readFileSync(file, "utf8");
  const relative = path.relative(root, file);
  if (html.includes("/mbe-unified.js?") && !html.includes(`/mbe-unified.js?v=${unifiedVersion}`)) {
    errors.push(`${relative} has a stale mbe-unified.js cache version`);
  }
  if (html.includes("/vendor/tailwind.js?") && !html.includes(`/vendor/tailwind.js?v=${tailwindRuntimeVersion}`)) {
    errors.push(`${relative} has a stale Tailwind runtime cache version`);
  }
}

if (errors.length) {
  console.error(`Production repair validation failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join("\n")}`);
  process.exit(1);
}

console.log(`Production repair validation passed across ${htmlFiles.length} HTML files and ${expectedFields.length} dynamic controls.`);
