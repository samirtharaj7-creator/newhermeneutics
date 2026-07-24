(() => {
  const askAiHref = "/ask-ai/";
  const downloadsHref = "/downloads/";
  const askAiIcon = `
    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path>
      <path d="M8 9h8"></path>
      <path d="M8 13h5"></path>
    </svg>`;
  const downloadIcon = `
    <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 3v12"></path>
      <path d="m7 10 5 5 5-5"></path>
      <path d="M5 21h14"></path>
    </svg>`;

  const isAskAiPath = () => window.location.pathname.replace(/\/+$/, "/") === askAiHref;
  const isDownloadsPath = () => window.location.pathname.replace(/\/+$/, "/") === downloadsHref;

  const ensureDesktopAskAiLink = () => {
    const nav = document.querySelector("body.guide-theme #root > div > header nav");
    if (!nav || nav.querySelector("[data-ask-ai-link='desktop']")) return;

    const link = document.createElement("a");
    link.className = "guide-downloads-link";
    link.href = askAiHref;
    link.setAttribute("data-ask-ai-link", "desktop");
    if (isAskAiPath()) link.setAttribute("aria-current", "page");
    link.innerHTML = `${askAiIcon}<span>Ask AI</span>`;

    const downloadsItem = Array.from(nav.children).find((item) =>
      /\bDownloads\b/.test(item.textContent || ""),
    );
    const resourcesItem = Array.from(nav.children).find((item) =>
      /\bResources\b/.test(item.textContent || ""),
    );
    nav.insertBefore(link, downloadsItem || resourcesItem || nav.lastElementChild);
  };

  const ensureDesktopDownloadsLink = () => {
    const nav = document.querySelector("body.guide-theme #root > div > header nav");
    if (!nav || nav.querySelector("[data-downloads-link='desktop']")) return;

    const link = document.createElement("a");
    link.className = "guide-downloads-link";
    link.href = downloadsHref;
    link.setAttribute("data-downloads-link", "desktop");
    if (isDownloadsPath()) link.setAttribute("aria-current", "page");
    link.innerHTML = `${downloadIcon}<span>Downloads</span>`;

    const resourcesItem = Array.from(nav.children).find((item) =>
      /\bResources\b/.test(item.textContent || ""),
    );
    nav.insertBefore(link, resourcesItem || nav.lastElementChild);
  };

  const ensureMobileDownloadsLink = () => {
    const panel = document.querySelector("body.guide-theme #root > div > header > div + div");
    if (!panel || panel.querySelector("[data-downloads-link='mobile']")) return;

    const container = panel.querySelector(".mt-5") || panel;
    const link = document.createElement("a");
    link.href = downloadsHref;
    link.setAttribute("data-downloads-link", "mobile");
    link.textContent = "Downloads";

    const resourcesSection = Array.from(container.children).find((item) =>
      /\bResources\b/.test(item.textContent || ""),
    );
    container.insertBefore(link, resourcesSection || null);
  };

  const ensureMobileAskAiLink = () => {
    const panel = document.querySelector("body.guide-theme #root > div > header > div + div");
    if (!panel || panel.querySelector("[data-ask-ai-link='mobile']")) return;

    const container = panel.querySelector(".mt-5") || panel;
    const link = document.createElement("a");
    link.href = askAiHref;
    link.setAttribute("data-ask-ai-link", "mobile");
    if (isAskAiPath()) link.setAttribute("aria-current", "page");
    link.textContent = "Ask AI";

    const downloadsItem = Array.from(container.children).find((item) =>
      /\bDownloads\b/.test(item.textContent || ""),
    );
    const resourcesSection = Array.from(container.children).find((item) =>
      /\bResources\b/.test(item.textContent || ""),
    );
    container.insertBefore(link, downloadsItem || resourcesSection || null);
  };

  const enhanceGuideUtilityLinks = () => {
    ensureDesktopAskAiLink();
    ensureDesktopDownloadsLink();
    ensureMobileAskAiLink();
    ensureMobileDownloadsLink();
  };

  enhanceGuideUtilityLinks();
  new MutationObserver(enhanceGuideUtilityLinks).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
