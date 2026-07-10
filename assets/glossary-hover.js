(function () {
  const marker = "__hermeneuticsGlossaryHoverV2";
  if (window[marker]) return;
  window[marker] = true;

  const terms = [
    ["Allegory", "A reading that treats details as hidden spiritual symbols. Responsible interpretation avoids uncontrolled allegory."],
    ["Allusion", "A clear but indirect reference to an earlier biblical text, image, event, or phrase without directly quoting it."],
    ["Analogy of Faith", "The principle that Scripture interprets Scripture, so clearer passages help explain more difficult passages without forcing contradiction."],
    ["Apocalyptic", "Symbolic prophecy that often uses visions, angels, beasts, time periods, heavenly scenes, and broad historical movement."],
    ["Application", "The faithful response the text calls for today after interpretation has been done carefully."],
    ["Authorial Intent", "The meaning the biblical author intended to communicate, under the inspiration of the Holy Spirit."],
    ["Canon", "The whole collection of Scripture, which helps individual passages be read within the full biblical witness."],
    ["Chiasm", "A mirrored literary pattern, often described as A-B-C-B-A, that may highlight the center or boundaries of a unit."],
    ["Citation", "An explicit reference to another biblical text or source, sometimes named directly and sometimes signaled by an introductory formula."],
    ["Clause", "A group of words with a subject and verbal idea. Main clauses carry the thought; subordinate clauses depend on another clause."],
    ["Contemporization", "Restating or illustrating a biblical situation in today's world so the original force of the passage becomes concrete for modern hearers."],
    ["Context", "The surrounding words, paragraphs, book setting, historical situation, and canonical location of a passage."],
    ["Covenant Lawsuit", "A prophetic form where God brings charges against His people for covenant unfaithfulness and calls them to return."],
    ["Day-Year Principle", "A principle used carefully in symbolic apocalyptic prophecy where a prophetic day represents a literal year."],
    ["Deductive Study", "A study approach that starts with a conclusion or topic and then looks for texts to support it."],
    ["Descriptive", "Material that tells what happened without automatically commanding the reader to imitate it."],
    ["Echo", "A subtle biblical resonance that recalls an earlier theme, image, or phrase. Echoes should be held more cautiously than direct quotations."],
    ["Genre", "The kind of literature a passage is, such as poetry, narrative, law, parable, epistle, prophecy, or wisdom."],
    ["Great Controversy", "The Bible's cosmic conflict theme, centered on God's character, Christ's victory, Satan's rebellion, sin, judgment, and restoration."],
    ["Hermeneutics", "The art and science of interpreting Scripture faithfully."],
    ["Imagination", "Thoughtfully entering a passage's scene, emotion, and concrete world without inventing meaning beyond the text."],
    ["Inclusio", "A bookend pattern where a section begins and ends with similar words or themes."],
    ["Inductive Study", "A method that moves from observation of the text toward interpretation and application."],
    ["Interpretation", "The work of explaining what the passage meant in its own setting before applying it today."],
    ["Observation", "Careful attention to what the text says: words, structure, repetition, grammar, setting, and movement."],
    ["Parable", "A vivid kingdom story or comparison that exposes assumptions and demands a response."],
    ["Phrase", "A meaningful group of words that does not always contain a full subject and verb but supports a main thought."],
    ["Preunderstanding", "The assumptions, experiences, traditions, habits, and prior teaching a reader brings to the text before studying it."],
    ["Principlizing Bridge", "A process for moving from original meaning to a timeless theological principle and then to modern application."],
    ["Prescriptive", "Material that gives a command, instruction, or intended pattern for God's people."],
    ["Proposition", "A complete thought or claim that can be related to other thoughts in argument diagramming."],
    ["Quotation", "A direct use of earlier biblical wording. Quotations usually carry the earlier passage's context into the new passage."],
    ["Reader Response", "A reading approach where the reader's feelings, needs, or experience controls the meaning instead of the author's intended meaning."],
    ["Recapitulation", "A repeat-and-enlarge pattern where later visions revisit the same historical span with added detail."],
    ["Rhetorical Question", "A question asked to persuade, expose, or advance an argument rather than simply request information."],
    ["Semantic Range", "The range of possible meanings a word can have; context determines which meaning is intended in a specific passage."],
    ["S.P.A.C.E.P.E.T.S.", "A simple application checklist: Sin, Promise, Attitude, Command, Example, Prayer, Error, Truth, and Something to thank God for."],
    ["Typology", "A biblical pattern where a real person, event, or institution foreshadows a greater fulfillment, usually in Christ."]
  ];

  const definitionByTerm = new Map(terms.map(([term, definition]) => [normalize(term), { term, definition }]));
  const termPattern = new RegExp(
    "(^|[^A-Za-z0-9])(" +
      terms
        .map(([term]) => escapeRegExp(term))
        .sort((a, b) => b.length - a.length)
        .join("|") +
      ")(?![A-Za-z0-9])",
    "gi"
  );

  const skipSelector = [
    "a",
    "button",
    "code",
    "pre",
    "kbd",
    "samp",
    "script",
    "style",
    "textarea",
    "input",
    "select",
    "option",
    "nav",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "strong[class*='bg-amber-100'][class*='text-amber-950']",
    "strong[class*='bg-sky-100'][class*='text-sky-950']",
    "strong[class*='bg-indigo-100'][class*='text-indigo-950']",
    "strong[class*='bg-fuchsia-100'][class*='text-fuchsia-950']",
    "strong[class*='bg-emerald-100'][class*='text-emerald-950']",
    "[data-glossary-hover-term]",
    "[data-glossary-skip]"
  ].join(",");

  const allowedBlockSelector = "p,li,dd,td,blockquote,figcaption,span";
  const maxDecoratedTerms = 120;
  let scheduled = false;
  let activeTerm = null;

  injectStyles();

  function normalize(value) {
    return String(value).replace(/\s+/g, " ").trim().toLowerCase();
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function injectStyles() {
    if (document.getElementById("glossary-hover-styles")) return;
    const style = document.createElement("style");
    style.id = "glossary-hover-styles";
    style.textContent = `
      .glossary-hover-term {
        display: inline;
        appearance: none;
        border: 0;
        border-bottom: 1px dotted rgba(67, 56, 202, 0.85);
        border-radius: 3px;
        background: rgba(238, 242, 255, 0.9);
        color: #312e81;
        cursor: help;
        font: inherit;
        font-weight: 800;
        line-height: inherit;
        padding: 0 0.125rem;
        text-align: inherit;
        transition: background-color 160ms ease, color 160ms ease, box-shadow 160ms ease;
      }
      .glossary-hover-term:hover,
      .glossary-hover-term:focus-visible,
      .glossary-hover-term[data-glossary-active="true"] {
        background: #e0e7ff;
        color: #1e1b4b;
        box-shadow: 0 0 0 2px rgba(129, 140, 248, 0.22);
        outline: none;
      }
      .glossary-hover-tooltip {
        position: fixed;
        z-index: 9999;
        max-width: min(360px, calc(100vw - 24px));
        border: 1px solid rgba(199, 210, 254, 0.95);
        border-radius: 14px;
        background: #fff;
        box-shadow: 0 22px 48px rgba(15, 23, 42, 0.18), 0 2px 8px rgba(15, 23, 42, 0.08);
        color: #475569;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        line-height: 1.5;
        padding: 0.8rem 0.9rem;
        pointer-events: none;
      }
      .glossary-hover-tooltip strong {
        display: block;
        margin-bottom: 0.2rem;
        color: #312e81;
        font-size: 0.9rem;
        font-weight: 900;
      }
      .glossary-hover-tooltip[hidden] {
        display: none;
      }
      @media print {
        .glossary-hover-tooltip {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function getTooltip() {
    let tooltip = document.getElementById("glossary-hover-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("span");
      tooltip.id = "glossary-hover-tooltip";
      tooltip.className = "glossary-hover-tooltip";
      tooltip.setAttribute("role", "tooltip");
      tooltip.hidden = true;
      document.body.appendChild(tooltip);
    }
    return tooltip;
  }

  function makeTermButton(text, details) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "glossary-hover-term";
    button.textContent = text;
    button.dataset.glossaryHoverTerm = details.term;
    button.dataset.glossaryDefinition = details.definition;
    button.setAttribute("aria-label", `${details.term}: ${details.definition}`);
    button.setAttribute("aria-describedby", "glossary-hover-tooltip");
    return button;
  }

  function shouldDecorateTextNode(node) {
    if (!node.nodeValue || !node.nodeValue.trim()) return false;
    const parent = node.parentElement;
    if (!parent || parent.closest(skipSelector)) return false;
    if (!parent.closest(allowedBlockSelector)) return false;
    return true;
  }

  function decorateTextNode(node, state) {
    const text = node.nodeValue;
    termPattern.lastIndex = 0;
    let match;
    let lastIndex = 0;
    let changed = false;
    const fragment = document.createDocumentFragment();

    while ((match = termPattern.exec(text)) && state.count < maxDecoratedTerms) {
      const prefix = match[1] || "";
      const matchedText = match[2];
      const start = match.index + prefix.length;
      const end = start + matchedText.length;
      const details = definitionByTerm.get(normalize(matchedText));

      if (!details) continue;
      if (start > lastIndex) fragment.appendChild(document.createTextNode(text.slice(lastIndex, start)));
      fragment.appendChild(makeTermButton(matchedText, details));
      state.count += 1;
      changed = true;
      lastIndex = end;
    }

    if (!changed) return;
    if (lastIndex < text.length) fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    node.replaceWith(fragment);
  }

  function decorateGlossaryTerms() {
    scheduled = false;
    const roots = document.querySelectorAll("main .prose, main");
    const state = { count: 0 };

    roots.forEach((root) => {
      if (state.count >= maxDecoratedTerms) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          return shouldDecorateTextNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes = [];
      while (walker.nextNode() && state.count < maxDecoratedTerms) nodes.push(walker.currentNode);
      nodes.forEach((node) => decorateTextNode(node, state));
    });
  }

  function scheduleDecorate() {
    if (scheduled) return;
    scheduled = true;
    window.requestAnimationFrame(decorateGlossaryTerms);
  }

  function positionTooltip(target, tooltip) {
    const margin = 12;
    const rect = target.getBoundingClientRect();
    tooltip.hidden = false;
    tooltip.style.visibility = "hidden";
    tooltip.style.left = "0px";
    tooltip.style.top = "0px";
    const width = Math.min(360, window.innerWidth - margin * 2);
    tooltip.style.width = `${width}px`;
    const tipRect = tooltip.getBoundingClientRect();
    const left = Math.min(Math.max(rect.left + rect.width / 2 - width / 2, margin), window.innerWidth - width - margin);
    const below = rect.bottom + 10;
    const above = rect.top - tipRect.height - 10;
    const top = below + tipRect.height <= window.innerHeight - margin ? below : Math.max(margin, above);
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
    tooltip.style.visibility = "visible";
  }

  function showTooltip(target) {
    if (!target || !target.dataset.glossaryHoverTerm) return;
    if (activeTerm && activeTerm !== target) activeTerm.removeAttribute("data-glossary-active");
    activeTerm = target;
    activeTerm.dataset.glossaryActive = "true";
    const tooltip = getTooltip();
    tooltip.innerHTML = `<strong>${escapeHtml(target.dataset.glossaryHoverTerm)}</strong>${escapeHtml(target.dataset.glossaryDefinition)}`;
    positionTooltip(target, tooltip);
  }

  function hideTooltip(target) {
    if (target && activeTerm && target !== activeTerm) return;
    if (activeTerm) activeTerm.removeAttribute("data-glossary-active");
    activeTerm = null;
    const tooltip = getTooltip();
    tooltip.hidden = true;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  document.addEventListener("pointerover", (event) => {
    const target = event.target.closest && event.target.closest("[data-glossary-hover-term]");
    if (target) showTooltip(target);
  });

  document.addEventListener("pointerout", (event) => {
    const target = event.target.closest && event.target.closest("[data-glossary-hover-term]");
    if (target && !target.contains(event.relatedTarget)) hideTooltip(target);
  });

  document.addEventListener("focusin", (event) => {
    const target = event.target.closest && event.target.closest("[data-glossary-hover-term]");
    if (target) showTooltip(target);
  });

  document.addEventListener("focusout", (event) => {
    const target = event.target.closest && event.target.closest("[data-glossary-hover-term]");
    if (target) hideTooltip(target);
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest && event.target.closest("[data-glossary-hover-term]");
    if (!target) {
      hideTooltip();
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (activeTerm === target && getTooltip().hidden === false) {
      hideTooltip(target);
    } else {
      showTooltip(target);
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hideTooltip();
  });

  window.addEventListener("scroll", () => activeTerm && positionTooltip(activeTerm, getTooltip()), { passive: true });
  window.addEventListener("resize", () => activeTerm && positionTooltip(activeTerm, getTooltip()));
  window.addEventListener("hashchange", scheduleDecorate);
  window.addEventListener("popstate", scheduleDecorate);

  const observer = new MutationObserver((mutations) => {
    if (mutations.some((mutation) => mutation.addedNodes.length)) scheduleDecorate();
  });

  function boot() {
    scheduleDecorate();
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
