import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://hermeneutics.mybibleexplorer.com";

const routes = [
  {
    id: "intro",
    path: "/general/",
    title: "General Hermeneutics Overview | Hermeneutics Guide",
    description: "Explore the Detective Method: a careful, inductive path for preparing, observing, interpreting, imagining, and applying Scripture."
  },
  {
    id: "general-preparation",
    path: "/general/preparation/",
    title: "Preparation in Bible Study | General Hermeneutics",
    description: "Begin Bible study with prayerful humility, named assumptions, and a willingness to be corrected by Scripture."
  },
  {
    id: "general-observation",
    path: "/general/observation/",
    title: "Observation in Bible Study | General Hermeneutics",
    description: "Learn to notice repeated words, structure, people, commands, contrasts, and textual clues before explaining a passage."
  },
  {
    id: "general-interpretation",
    path: "/general/interpretation/",
    title: "Interpretation in Bible Study | General Hermeneutics",
    description: "Test a passage's meaning through authorial intent, genre, grammar, historical setting, context, and the whole witness of Scripture."
  },
  {
    id: "general-imagination",
    path: "/general/imagination/",
    title: "Imagination in Bible Study | General Hermeneutics",
    description: "Enter the world of the passage carefully without inventing details or replacing interpretation with imagination."
  },
  {
    id: "general-application",
    path: "/general/application/",
    title: "Application in Bible Study | General Hermeneutics",
    description: "Bring Scripture's meaning into life with faithful principles, concrete obedience, worship, and transformation."
  },
  {
    id: "special",
    path: "/special/",
    title: "Special Hermeneutics by Genre | Hermeneutics Guide",
    description: "Read poetry, narrative, Gospels and Acts, epistles, law, parables, prophecy, and wisdom according to their biblical genre."
  },
  {
    id: "poetry",
    path: "/special/poetry/",
    title: "How to Read Biblical Poetry | Special Hermeneutics",
    description: "Interpret biblical poetry through parallelism, imagery, voice shifts, emotional movement, worship, lament, and prayer."
  },
  {
    id: "history",
    path: "/special/historical-narrative/",
    title: "How to Read Historical Narrative | Special Hermeneutics",
    description: "Read biblical narrative as theological history by tracing plot, setting, character, conflict, and redemptive movement."
  },
  {
    id: "gospels-acts",
    path: "/special/gospels-acts/",
    title: "How to Read Gospels and Acts | Special Hermeneutics",
    description: "Read the Gospels as theological biography and Acts as the continuing mission of the risen Jesus through the Spirit."
  },
  {
    id: "epistles",
    path: "/special/epistles/",
    title: "How to Read Epistles | Special Hermeneutics",
    description: "Interpret New Testament letters through argument flow, grammar, occasion, theology, and pastoral application."
  },
  {
    id: "law",
    path: "/special/law/",
    title: "How to Read Biblical Law | Special Hermeneutics",
    description: "Read biblical law through covenant setting, holiness, justice, worship, wisdom, and fulfillment in Christ."
  },
  {
    id: "parables",
    path: "/special/parables/",
    title: "How to Read Parables | Special Hermeneutics",
    description: "Interpret Jesus' parables through setting, audience, surprise, kingdom focus, and the main point of the story."
  },
  {
    id: "prophecy",
    path: "/special/prophecy/",
    title: "How to Read Biblical Prophecy | Special Hermeneutics",
    description: "Read prophecy through covenant lawsuit, warning, hope, symbolic imagery, fulfillment, and final restoration."
  },
  {
    id: "wisdom",
    path: "/special/wisdom/",
    title: "How to Read Wisdom Literature | Special Hermeneutics",
    description: "Read biblical wisdom through fear of the Lord, poetic compression, real-life patterns, suffering, and faithful discernment."
  },
  {
    id: "ai-interpreter",
    path: "/workbook/",
    title: "Guided Hermeneutics Workbook | My Bible Explorer",
    description: "Practice the hermeneutics method with a guided workbook that walks through preparation, observation, interpretation, imagination, and application."
  },
  {
    id: "resources",
    path: "/resources/",
    title: "Hermeneutics Resources | My Bible Explorer",
    description: "Find study helps, common misreadings, glossary terms, and printable resources for learning biblical interpretation."
  },
  {
    id: "common-misreadings",
    path: "/resources/common-misreadings/",
    title: "Common Bible Misreadings Clinic | Hermeneutics Guide",
    description: "Practice correcting common Bible misreadings by restoring context, authorial intent, and faithful application."
  },
  {
    id: "glossary",
    path: "/resources/glossary/",
    title: "Hermeneutics Glossary | My Bible Explorer",
    description: "Learn key Bible interpretation terms used throughout the Hermeneutics Guide."
  },
  {
    id: "credits-sources",
    path: "/credits/",
    title: "Credits and Sources | Hermeneutics Guide",
    description: "Review the credits and sources behind the Hermeneutics Guide."
  }
];

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function replaceTag(html, pattern, replacement) {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace("</head>", `${replacement}\n  </head>`);
}

function breadcrumbJson(route) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Hermeneutics Guide",
        item: `${siteUrl}/`
      },
      {
        "@type": "ListItem",
        position: 2,
        name: route.title.split(" | ")[0],
        item: `${siteUrl}${route.path}`
      }
    ]
  });
}

function routeHtml(template, route) {
  const canonical = `${siteUrl}${route.path}`;
  let html = template;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(route.title)}</title>`);
  html = replaceTag(html, /<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${escapeAttr(route.description)}" />`);
  html = replaceTag(html, /<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${escapeAttr(route.title)}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${escapeAttr(route.description)}" />`);
  html = replaceTag(html, /<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/>/, `<meta name="twitter:title" content="${escapeAttr(route.title)}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/>/, `<meta name="twitter:description" content="${escapeAttr(route.description)}" />`);
  html = html.replace(
    "</head>",
    `    <script id="hermeneutics-breadcrumb-jsonld" type="application/ld+json">${breadcrumbJson(route)}</script>\n  </head>`
  );
  return html;
}

const template = fs.readFileSync(path.join(root, "index.html"), "utf8");

for (const route of routes) {
  const directory = path.join(root, route.path);
  fs.mkdirSync(directory, { recursive: true });
  fs.writeFileSync(path.join(directory, "index.html"), routeHtml(template, route));
  console.log(`Generated ${route.path} -> ${route.id}`);
}
