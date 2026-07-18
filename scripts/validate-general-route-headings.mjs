import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(scriptDirectory, "..");
const errors = [];
const appBundleVersion = "general-route-h1-1";
const phaseRoutes = [
  ["general-preparation", "general/preparation/index.html"],
  ["general-observation", "general/observation/index.html"],
  ["general-interpretation", "general/interpretation/index.html"],
  ["general-imagination", "general/imagination/index.html"],
  ["general-application", "general/application/index.html"]
];
const bundles = readdirSync(path.join(root, "assets"))
  .filter((name) => /^index-[a-z0-9]+\.js$/i.test(name));

if (bundles.length !== 1) {
  errors.push(`Expected one application bundle, found ${bundles.length}`);
} else {
  const bundle = readFileSync(path.join(root, "assets", bundles[0]), "utf8");
  const phaseH1 = 'e.jsx("h1",{className:`m-0 text-lg font-black ${ghPhaseTitle(t)}`,children:a.title})';
  const obsoletePhaseH2 = 'e.jsx("h2",{className:`m-0 text-lg font-black ${ghPhaseTitle(t)}`,children:a.title})';
  const phaseCallout = 't!=="intro"&&e.jsx(ghDetectiveCallout,{phase:t})';
  const overviewH1 = 'K=({children:t})=>e.jsx("h1"';

  if (bundle.split(phaseH1).length - 1 !== 1) {
    errors.push("The General phase callout must render exactly one h1 title");
  }
  if (bundle.includes(obsoletePhaseH2)) {
    errors.push("The General phase callout still renders its title as h2");
  }
  if (bundle.split(phaseCallout).length - 1 !== 1) {
    errors.push("The General phase h1 callout must remain limited to non-overview routes");
  }
  if (bundle.split(overviewH1).length - 1 !== 1) {
    errors.push("The General overview must retain its dedicated h1 component");
  }
}

for (const [routeId, relativePath] of phaseRoutes) {
  const html = readFileSync(path.join(root, relativePath), "utf8");
  const routePath = `/${relativePath.replace(/index\.html$/, "")}`;
  const routeMetadata = readFileSync(path.join(root, "assets", "hermeneutics-route-meta.js"), "utf8");
  if (!routeMetadata.includes(`id: "${routeId}"`) || !routeMetadata.includes(`path: "${routePath}"`)) {
    errors.push(`The route metadata does not map ${routePath} to ${routeId}`);
  }
  if (!html.includes(`<link rel="canonical" href="https://hermeneutics.mybibleexplorer.com${routePath}"`)) {
    errors.push(`${relativePath} has an incorrect canonical route`);
  }
  const bundleReferences = html.match(/\/assets\/index-[a-z0-9]+\.js\?v=[^"']+/gi) || [];
  if (bundleReferences.length !== 2) {
    errors.push(`${relativePath} must preload and load the application bundle exactly once each`);
  }
  if (bundleReferences.some((reference) => !reference.endsWith(`?v=${appBundleVersion}`))) {
    errors.push(`${relativePath} has a stale application bundle cache version`);
  }
}

if (errors.length) {
  console.error(
    `General route heading validation failed with ${errors.length} error(s):\n${errors.map((error) => `- ${error}`).join("\n")}`
  );
  process.exit(1);
}

console.log(
  `General route heading validation passed for the overview and ${phaseRoutes.length} routed phases.`
);
