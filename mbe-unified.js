(() => {
  const tool = "hermeneutics";
  const headerMarkup = "<header class=\"mbe-global-shell\" data-tool=\"hermeneutics\" data-embedded=\"true\">\n      <div class=\"mbe-shell-wrap\">\n        <div class=\"mbe-ribbon-left\">\n          <a class=\"mbe-ribbon-brand\" href=\"https://mybibleexplorer.com\" aria-label=\"My Bible Explorer home\"><img class=\"mbe-ribbon-logo\" src=\"/assets/my-bible-explorer-logo.png?v=local-logo-1\" alt=\"My Bible Explorer\" width=\"107\" height=\"34\"></a>\n          <a class=\"mbe-ribbon-back\" href=\"https://mybibleexplorer.com/#journeys\">Back to Library</a>\n        </div>\n        <nav class=\"mbe-global-nav\" aria-label=\"My Bible Explorer\">\n          <details class=\"mbe-library-menu\">\n            <summary class=\"mbe-library-toggle\">Library</summary>\n            <div class=\"mbe-library-panel\">\n              <div class=\"mbe-library-grid\">\n            <a class=\"mbe-library-item\" href=\"https://hermeneutics.mybibleexplorer.com\" aria-current=\"page\"><span class=\"mbe-library-name\">Hermeneutics</span><span class=\"mbe-library-desc\">Learn to read Scripture faithfully</span></a>\n            <a class=\"mbe-library-item\" href=\"https://psalms.mybibleexplorer.com\"><span class=\"mbe-library-name\">Psalms</span><span class=\"mbe-library-desc\">Worship, lament, praise, and prayer</span></a>\n            <a class=\"mbe-library-item\" href=\"https://sanctuary.mybibleexplorer.com/#structure\"><span class=\"mbe-library-name\">Sanctuary</span><span class=\"mbe-library-desc\">A blueprint of salvation</span></a>\n            <a class=\"mbe-library-item\" href=\"https://lastdayevents.mybibleexplorer.com/index.html\"><span class=\"mbe-library-name\">Last Day Events</span><span class=\"mbe-library-desc\">Earth's final chapter</span></a>\n            <a class=\"mbe-library-item\" href=\"https://parables.mybibleexplorer.com\"><span class=\"mbe-library-name\">Parables</span><span class=\"mbe-library-desc\">Stories of the kingdom</span></a>\n            <a class=\"mbe-library-item\" href=\"https://romans.mybibleexplorer.com\"><span class=\"mbe-library-name\">Romans</span><span class=\"mbe-library-desc\">Righteousness by faith and life in the Spirit</span></a>\n            <a class=\"mbe-library-item\" href=\"https://corinthians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Corinthians</span><span class=\"mbe-library-desc\">Unity, worship, holy living, and resurrection</span></a>\n            <a class=\"mbe-library-item\" href=\"https://galatians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Galatians</span><span class=\"mbe-library-desc\">Freedom in Christ and life by the Spirit</span></a>\n            <a class=\"mbe-library-item\" href=\"https://ephesians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Ephesians</span><span class=\"mbe-library-desc\">Grace, unity, new life, and spiritual warfare</span></a>\n            <a class=\"mbe-library-item\" href=\"https://philippians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Philippians</span><span class=\"mbe-library-desc\">Joy, humility, perseverance, and contentment</span></a>\n            <a class=\"mbe-library-item\" href=\"https://colossians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Colossians</span><span class=\"mbe-library-desc\">The supremacy of Christ and life in Him</span></a>\n            <a class=\"mbe-library-item\" href=\"https://hebrews.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Hebrews</span><span class=\"mbe-library-desc\">Christ, covenant, sanctuary, and persevering faith</span></a>\n            <a class=\"mbe-library-item\" href=\"https://james.mybibleexplorer.com/\"><span class=\"mbe-library-name\">James</span><span class=\"mbe-library-desc\">Living faith, wisdom, speech, patience, and prayer</span></a>\n            <a class=\"mbe-library-item\" href=\"https://isaiah.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Isaiah</span><span class=\"mbe-library-desc\">Judgment, comfort, and gospel hope</span></a>\n            <a class=\"mbe-library-item\" href=\"https://daniel.mybibleexplorer.com\"><span class=\"mbe-library-name\">Daniel</span><span class=\"mbe-library-desc\">Prophecy and providence</span></a>\n            <a class=\"mbe-library-item\" href=\"https://revelation.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Revelation</span><span class=\"mbe-library-desc\">Symbols, judgment, and final hope</span></a>\n            <a class=\"mbe-library-item\" href=\"https://christ.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Life of Christ</span><span class=\"mbe-library-desc\">The life and ministry of Jesus</span></a>\n              </div>\n            </div>\n          </details>\n          <a class=\"mbe-ribbon-give\" href=\"https://mybibleexplorer.com/#donate\">Support</a>\n        </nav>\n      </div>\n    </header>";
  const footerMarkup = "<footer class=\"mbe-global-footer\" data-tool=\"hermeneutics\">\n      <div class=\"mbe-shell-wrap mbe-footer-wrap\">\n        <a class=\"mbe-footer-brand\" href=\"https://mybibleexplorer.com\" aria-label=\"My Bible Explorer home\"><img class=\"mbe-footer-logo\" src=\"/assets/my-bible-explorer-logo.png?v=local-logo-1\" alt=\"My Bible Explorer\" width=\"107\" height=\"34\"></a>\n        <span>Know the Word. Live the Word.</span>\n        <span>To contact, email <a class=\"mbe-footer-link\" href=\"mailto:admin@mybibleexplorer.com\">admin@mybibleexplorer.com</a></span>\n        <a class=\"mbe-footer-link\" href=\"https://mybibleexplorer.com/#donate\">Support</a>\n        <span>&copy; <span data-mbe-year></span> My Bible Explorer</span>\n      </div>\n    </footer>\n    ";
  const dynamicControlLabels = [
    { label: "Select a Book", selector: "select" },
    { label: "Bible Reference", selector: "input" },
    { label: "Manual Genre Override", selector: "select" },
    { label: "Optional Notes or Initial Observations", selector: "textarea" }
  ];
  let dynamicControlObserver = null;

  function updateYear() {
    document.querySelectorAll('[data-mbe-year]').forEach((node) => {
      node.textContent = new Date().getFullYear();
    });
  }

  function ensureShell() {
    if (!document.body) return;
    document.body.classList.add('mbe-shell-managed');
    document.querySelectorAll('.mbe-global-shell').forEach((node, index) => {
      if (index > 0 || node.getAttribute('data-tool') !== tool || !node.hasAttribute('data-embedded')) node.remove();
    });
    if (!document.querySelector('.mbe-global-shell[data-tool="' + tool + '"][data-embedded="true"]')) {
      document.body.insertAdjacentHTML('afterbegin', headerMarkup);
    }
    const existingFooters = Array.from(document.querySelectorAll('.mbe-global-footer'));
    let footer = existingFooters.find((node) => node.getAttribute('data-tool') === tool) || null;
    existingFooters.forEach((node) => {
      if (node !== footer) node.remove();
    });
    if (!footer) {
      document.body.insertAdjacentHTML('beforeend', footerMarkup);
      footer = document.querySelector('.mbe-global-footer[data-tool="' + tool + '"]');
    }
    if (footer && footer.parentElement === document.body && footer !== document.body.lastElementChild) {
      document.body.appendChild(footer);
    }
    updateYear();
  }

  function labelDynamicControls() {
    document.querySelectorAll('label').forEach((label) => {
      const labelText = label.textContent.replace(/\s+/g, ' ').trim();
      const field = dynamicControlLabels.find((entry) => entry.label === labelText);
      if (!field) return;

      const control = label.nextElementSibling;
      if (!control || !control.matches(field.selector)) return;
      if (control.labels && control.labels.length > 0) return;
      if (control.getAttribute('aria-label') || control.getAttribute('aria-labelledby')) return;
      control.setAttribute('aria-label', field.label);
    });
  }

  function observeDynamicControls() {
    if (!document.body || dynamicControlObserver) return;
    labelDynamicControls();
    dynamicControlObserver = new MutationObserver((records) => {
      if (records.some((record) => record.addedNodes.length > 0)) labelDynamicControls();
    });
    dynamicControlObserver.observe(document.body, { childList: true, subtree: true });
  }

  function refreshPageEnhancements() {
    ensureShell();
    observeDynamicControls();
    labelDynamicControls();
  }

  function bindStaticHomeNavigation() {
    document.addEventListener('click', (event) => {
      const control = event.target.closest('button');
      if (!control || !control.closest('#root header')) return;

      const label = control.textContent.replace(/\s+/g, ' ').trim();
      const compactLabel = label.replace(/\s+/g, '').toLowerCase();
      if (label !== 'Home' && compactLabel !== 'hermeneuticsguide') return;

      event.preventDefault();
      event.stopImmediatePropagation();
      window.location.assign('/');
    }, true);
  }

  bindStaticHomeNavigation();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', refreshPageEnhancements, { once: true });
  } else {
    refreshPageEnhancements();
  }
  window.addEventListener('load', () => {
    refreshPageEnhancements();
    window.setTimeout(refreshPageEnhancements, 300);
    window.setTimeout(refreshPageEnhancements, 1000);
  });
})();
