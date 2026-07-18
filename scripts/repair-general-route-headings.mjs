import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const bundles = readdirSync(path.join(root, "assets"))
  .filter((name) => /^index-[a-z0-9]+\.js$/i.test(name));

if (bundles.length !== 1) {
  throw new Error(`Expected one application bundle, found ${bundles.length}.`);
}

const bundlePath = path.join(root, "assets", bundles[0]);
const source = readFileSync(bundlePath, "utf8");
const oldHeading = 'e.jsx("h2",{className:`m-0 text-lg font-black ${ghPhaseTitle(t)}`,children:a.title})';
const newHeading = 'e.jsx("h1",{className:`m-0 text-lg font-black ${ghPhaseTitle(t)}`,children:a.title})';
const oldCount = source.split(oldHeading).length - 1;
const newCount = source.split(newHeading).length - 1;

if (oldCount === 0 && newCount === 1) {
  console.log(`${bundles[0]} already renders General phase titles as h1.`);
  process.exit(0);
}

if (oldCount !== 1 || newCount !== 0) {
  throw new Error(
    `Refusing to patch an unexpected application bundle (h2 matches: ${oldCount}; h1 matches: ${newCount}).`
  );
}

writeFileSync(bundlePath, source.replace(oldHeading, newHeading));
console.log(`Repaired General phase heading semantics in ${bundles[0]}.`);
