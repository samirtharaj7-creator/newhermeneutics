import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const runtimePath = path.resolve(scriptDirectory, "..", "vendor", "tailwind.js");
const checkOnly = process.argv.includes("--check");
const warningCall = 'console.warn("cdn.tailwindcss.com should not be used in production. To use Tailwind CSS in production, install it as a PostCSS plugin or use the Tailwind CLI: https://tailwindcss.com/docs/installation");';
const sanitizerMarker = "void 0/*mbe:self-hosted-tailwind-runtime*/;";

function occurrences(source, value) {
  return source.split(value).length - 1;
}

function sha256(source) {
  return createHash("sha256").update(source).digest("hex");
}

const source = readFileSync(runtimePath, "utf8");
const warningCount = occurrences(source, warningCall);
const markerCount = occurrences(source, sanitizerMarker);

if (checkOnly) {
  if (warningCount !== 0 || markerCount !== 1) {
    throw new Error(
      `Tailwind runtime is not deterministically sanitized (warning calls: ${warningCount}; markers: ${markerCount}). Run node scripts/sanitize-tailwind-runtime.mjs.`
    );
  }
  console.log(`Tailwind runtime sanitizer check passed (${sha256(source)}).`);
  process.exit(0);
}

if (warningCount === 0 && markerCount === 1) {
  console.log(`Tailwind runtime is already sanitized (${sha256(source)}).`);
  process.exit(0);
}

if (warningCount !== 1 || markerCount !== 0) {
  throw new Error(
    `Refusing to rewrite an unexpected Tailwind runtime (warning calls: ${warningCount}; markers: ${markerCount}).`
  );
}

const sanitized = source.replace(warningCall, sanitizerMarker);
writeFileSync(runtimePath, sanitized);
console.log(`Sanitized the self-hosted Tailwind runtime (${sha256(sanitized)}).`);
