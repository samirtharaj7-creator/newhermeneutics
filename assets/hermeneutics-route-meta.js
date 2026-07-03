(function () {
  const siteUrl = "https://hermeneutics.mybibleexplorer.com";
  const aliases = {
    "start-here": "intro",
    "beginner-path": "intro",
    "intermediate-path": "intro",
    "advanced-path": "intro",
    "general-overview": "intro",
    "general-method": "intro"
  };

  const routes = [
    {
      id: "home",
      path: "/",
      title: "Hermeneutics Guide | My Bible Explorer",
      description: "Learn a faithful Bible study method for reading Scripture with preparation, observation, interpretation, imagination, and application."
    },
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

  const byId = Object.fromEntries(routes.map((route) => [route.id, route]));
  const byPath = Object.fromEntries(routes.map((route) => [route.path, route.id]));

  function normalizePath(pathname) {
    if (!pathname || pathname === "/index.html") return "/";
    let path = pathname;
    if (path.endsWith("/index.html")) path = path.slice(0, -"index.html".length);
    if (!path.endsWith("/")) path += "/";
    return path;
  }

  function normalizeId(id) {
    return aliases[id] || id;
  }

  function idFromUrl(urlValue) {
    const url = new URL(urlValue || window.location.href, window.location.origin);
    const pageParam = url.searchParams.get("page");
    if (pageParam) return normalizeId(pageParam);
    const hashId = decodeURIComponent(url.hash.replace(/^#/, ""));
    if (hashId) return normalizeId(hashId);
    return byPath[normalizePath(url.pathname)] || "home";
  }

  function cleanUrlForId(id, urlValue) {
    const route = byId[normalizeId(id)];
    if (!route) return null;
    const url = new URL(urlValue || window.location.href, window.location.origin);
    url.searchParams.delete("page");
    const query = url.searchParams.toString();
    return `${route.path}${query ? `?${query}` : ""}`;
  }

  function canonicalForId(id) {
    const route = byId[normalizeId(id)] || byId.home;
    return `${siteUrl}${route.path === "/" ? "/" : route.path}`;
  }

  window.__HERMENEUTICS_SITE_URL__ = siteUrl;
  window.__HERMENEUTICS_ROUTES__ = routes;
  window.__HERMENEUTICS_ROUTE_BY_ID__ = byId;
  window.__HERMENEUTICS_ROUTE_BY_PATH__ = byPath;
  window.__HERMENEUTICS_ROUTE_ALIASES__ = aliases;
  window.__HERMENEUTICS_NORMALIZE_PATH__ = normalizePath;
  window.__HERMENEUTICS_NORMALIZE_ID__ = normalizeId;
  window.__HERMENEUTICS_ID_FROM_URL__ = idFromUrl;
  window.__HERMENEUTICS_CLEAN_URL_FOR_ID__ = cleanUrlForId;
  window.__HERMENEUTICS_CANONICAL_FOR_ID__ = canonicalForId;
})();
