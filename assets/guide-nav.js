/*
 * Hermeneutics Guide — single source of truth for the guide navigation bar.
 *
 * This replaces the two implementations that used to exist: hand-written markup
 * inside ask-ai/ and downloads/, and the header compiled into the React bundle
 * (assets/index-*.js). The React header is hidden and this bar is injected in
 * its place, so every page now renders the same nav from this one file.
 */
(function () {
  var LINKS = [
    { href: "/", label: "Home", match: ["/", "/index.html"], icon: '<path d="m3 11 9-8 9 8"></path><path d="M5 10v10h14V10"></path><path d="M9 20v-6h6v6"></path>' },
    { href: "/general/", label: "General", sub: "Hermeneutics", prefix: "/general", icon: '<path d="M2 4v16"></path><path d="M22 4v16"></path><path d="M2 5a3 3 0 0 1 3-3h5a2 2 0 0 1 2 2v16a2 2 0 0 0-2-2H5a3 3 0 0 0-3 3"></path><path d="M22 5a3 3 0 0 0-3-3h-5a2 2 0 0 0-2 2v16a2 2 0 0 1 2-2h5a3 3 0 0 1 3 3"></path>' },
    { href: "/special/", label: "Special", sub: "Hermeneutics", prefix: "/special", icon: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"></path>' },
    { href: "/ask-ai/", label: "Guided Study", prefix: "/ask-ai", icon: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"></path><path d="M8 9h8"></path><path d="M8 13h5"></path>' },
    { href: "/downloads/", label: "Downloads", prefix: "/downloads", icon: '<path d="M12 3v12"></path><path d="m7 10 5 5 5-5"></path><path d="M5 21h14"></path>' },
    { href: "/resources/", label: "Resources", prefix: "/resources", icon: '<path d="M12 3v18"></path><path d="M3 12h18"></path><path d="m5.6 5.6 12.8 12.8"></path><path d="m18.4 5.6-12.8 12.8"></path>' },
    { href: "/credits/", label: "Credits", prefix: "/credits", icon: '<path d="M6 3h12a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"></path><path d="M8 7h8"></path><path d="M8 11h8"></path><path d="M8 15h5"></path>' }
  ];

  var BRAND_GLYPH =
    '<path d="M12 3.5v3"></path><path d="m8 4.9 1.4 2.1"></path><path d="m16 4.9-1.4 2.1"></path>' +
    '<path d="M3.2 8.9c2.4-1.1 5.3-1.1 8.8 1.1v10.5c-3.5-2.2-6.4-2.2-8.8-1.1z"></path>' +
    '<path d="M20.8 8.9c-2.4-1.1-5.3-1.1-8.8 1.1v10.5c3.5-2.2 6.4-2.2 8.8-1.1z"></path>';

  var CSS = [
    /* The React bundle still renders its own header; hide it so only this bar shows. */
    ".guide-theme #root > div > header{display:none!important;}",
    ".guide-nav{",
    "  position:sticky;top:var(--mbe-ribbon-height,0px);z-index:900;",
    "  border-bottom:1px solid var(--gn-line,#dfe6e4);background:var(--gn-card,#fff);",
    "  font-family:var(--gn-sans,'IBM Plex Sans',system-ui,sans-serif);color:var(--gn-ink,#12181a);",
    "}",
    ".guide-nav *,.guide-nav *::before,.guide-nav *::after{box-sizing:border-box;}",
    ".guide-nav a{color:inherit;text-decoration:none;}",
    ".guide-nav-wrap{",
    "  display:flex;align-items:center;gap:clamp(10px,1.8vw,26px);",
    "  width:min(100%,92rem);margin:0 auto;padding:10px clamp(16px,3vw,32px);",
    "}",
    ".guide-brand{",
    "  display:flex;flex:0 0 auto;align-items:center;gap:0;min-height:44px;",
    "  padding:6px 10px;border:1px solid transparent;border-radius:8px;white-space:nowrap;",
    "  transition:background .2s ease,border-color .2s ease;",
    "}",
    ".guide-brand:hover{border-color:rgba(15,43,71,.18);background:var(--gn-hover,rgba(15,43,71,.07));}",
    ".guide-brand-mark{",
    "  display:grid;place-items:center;flex:0 0 auto;width:34px;height:34px;margin-right:10px;",
    "  border:1px solid rgba(15,43,71,.16);border-radius:10px;",
    "  background:var(--gn-active,rgba(15,43,71,.09));color:var(--gn-accent,#0f2b47);",
    "  transition:background .2s ease,border-color .2s ease;",
    "}",
    ".guide-brand:hover .guide-brand-mark{border-color:rgba(15,43,71,.28);background:#fff;}",
    ".guide-brand-mark svg{display:block;width:20px;height:20px;}",
    ".guide-brand-copy{display:grid;line-height:1;}",
    ".guide-brand-copy strong{color:var(--gn-ink,#12181a);font-size:14px;font-weight:700;}",
    ".guide-brand-copy small{",
    "  margin-top:4px;color:var(--gn-accent,#0f2b47);font-size:9px;font-weight:700;",
    "  letter-spacing:.08em;text-transform:uppercase;",
    "}",
    ".guide-links{display:flex;flex:1 1 auto;align-items:center;justify-content:space-between;gap:clamp(8px,1.4vw,26px);min-width:0;}",
    ".guide-link{",
    "  display:flex;align-items:center;gap:9px;min-height:44px;padding:8px 12px;border-radius:8px;",
    "  color:var(--gn-ink,#12181a);font-size:14px;font-weight:600;white-space:nowrap;",
    "  transition:background .2s ease,color .2s ease;",
    "}",
    '.guide-link:hover,.guide-link[aria-current="page"]{background:var(--gn-active,rgba(15,43,71,.09));color:var(--gn-accent-hover,#173a5b);}',
    '.guide-link[aria-current="page"] .nav-icon{color:var(--gn-accent,#0f2b47);}',
    ".guide-link-copy{display:grid;line-height:1.05;}",
    ".guide-link-copy small{margin-top:3px;font-size:9px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;opacity:.72;}",
    ".guide-nav .nav-icon{width:17px;height:17px;flex:0 0 auto;}",
    ".guide-menu{display:none;position:relative;margin-left:auto;}",
    ".guide-menu summary{",
    "  display:grid;place-items:center;width:44px;height:44px;border:1px solid var(--gn-line,#dfe6e4);",
    "  border-radius:8px;cursor:pointer;list-style:none;",
    "}",
    ".guide-menu summary::-webkit-details-marker{display:none;}",
    '.menu-icon,.menu-icon::before,.menu-icon::after{display:block;width:17px;height:2px;background:currentColor;content:"";}',
    ".menu-icon{position:relative;}",
    ".menu-icon::before{position:absolute;top:-6px;left:0;}",
    ".menu-icon::after{position:absolute;top:6px;left:0;}",
    ".guide-menu-panel{",
    "  position:absolute;top:50px;right:0;display:grid;width:min(260px,calc(100vw - 40px));",
    "  padding:8px;border:1px solid var(--gn-line,#dfe6e4);border-radius:8px;",
    "  background:var(--gn-card,#fff);box-shadow:0 24px 60px rgba(18,24,26,.16);",
    "}",
    ".guide-menu-panel a{display:flex;align-items:center;gap:9px;padding:11px 12px;border-radius:6px;font-size:14px;font-weight:600;}",
    '.guide-menu-panel a:hover,.guide-menu-panel a[aria-current="page"]{background:var(--gn-hover,rgba(15,43,71,.07));color:var(--gn-accent-hover,#173a5b);}',
    "@media (max-width:900px){",
    "  .guide-links{display:none;}",
    "  .guide-menu{display:block;}",
    "  .guide-nav-wrap{gap:16px;}",
    "}",
    "@media print{.guide-nav{display:none!important;}}"
  ].join("\n");

  function isCurrent(link, path) {
    if (link.match) return link.match.indexOf(path) !== -1;
    return link.prefix ? path.indexOf(link.prefix) === 0 : false;
  }

  function build(path) {
    var desktop = LINKS.map(function (l) {
      var current = isCurrent(l, path) ? ' aria-current="page"' : "";
      var copy = l.sub
        ? '<span class="guide-link-copy"><span>' + l.label + "</span><small>" + l.sub + "</small></span>"
        : "<span>" + l.label + "</span>";
      return (
        '<a class="guide-link" href="' + l.href + '"' + current + ">" +
        '<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        l.icon + "</svg>" + copy + "</a>"
      );
    }).join("");

    var mobile = LINKS.map(function (l) {
      var current = isCurrent(l, path) ? ' aria-current="page"' : "";
      var label = l.sub ? l.label + " " + l.sub : l.label;
      return '<a href="' + l.href + '"' + current + ">" + label + "</a>";
    }).join("");

    var nav = document.createElement("nav");
    nav.className = "guide-nav";
    nav.setAttribute("aria-label", "Hermeneutics Guide");
    nav.innerHTML =
      '<div class="guide-nav-wrap">' +
      '<a class="guide-brand" href="/" aria-label="Hermeneutics Guide home">' +
      '<span class="guide-brand-mark" aria-hidden="true">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      BRAND_GLYPH + "</svg></span>" +
      "<span class=\"guide-brand-copy\"><strong>Hermeneutics</strong><small>Guide</small></span></a>" +
      '<div class="guide-links">' + desktop + "</div>" +
      '<details class="guide-menu"><summary aria-label="Open guide navigation" title="Guide navigation"><span class="menu-icon" aria-hidden="true"></span></summary>' +
      '<div class="guide-menu-panel">' + mobile + "</div></details>" +
      "</div>";
    return nav;
  }

  function mount() {
    if (document.querySelector("nav.guide-nav[data-guide-nav]")) return;

    var style = document.createElement("style");
    style.setAttribute("data-guide-nav-style", "");
    style.textContent = CSS;
    document.head.appendChild(style);

    var path = window.location.pathname.replace(/index\.html$/, "") || "/";
    if (path.length > 1) path = path.replace(/\/$/, "") + "/";
    var nav = build(path === "/" ? "/" : path);
    nav.setAttribute("data-guide-nav", "");

    // Drop any pre-existing hand-written nav so only this one remains.
    var legacy = document.querySelector("nav.guide-nav:not([data-guide-nav])");
    if (legacy && legacy.parentNode) legacy.parentNode.removeChild(legacy);

    // Sits directly after the shared My Bible Explorer ribbon when present.
    var ribbon = document.querySelector("header.mbe-global-shell");
    var root = document.getElementById("root");
    if (ribbon && ribbon.parentNode) ribbon.parentNode.insertBefore(nav, ribbon.nextSibling);
    else if (root && root.parentNode) root.parentNode.insertBefore(nav, root);
    else document.body.insertBefore(nav, document.body.firstChild);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
