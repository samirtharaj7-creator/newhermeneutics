(() => {
  const tool = "hermeneutics";
  const headerMarkup = "<header class=\"mbe-global-shell\" data-tool=\"hermeneutics\" data-embedded=\"true\">\n      <div class=\"mbe-shell-wrap\">\n        <div class=\"mbe-ribbon-left\">\n          <a class=\"mbe-ribbon-brand\" href=\"https://mybibleexplorer.com\" aria-label=\"My Bible Explorer home\"><img class=\"mbe-ribbon-logo\" src=\"/assets/my-bible-explorer-logo.png?v=local-logo-1\" alt=\"My Bible Explorer\" width=\"107\" height=\"34\"></a>\n          <a class=\"mbe-ribbon-back\" href=\"https://mybibleexplorer.com/#journeys\">Back to Library</a>\n        </div>\n        <nav class=\"mbe-global-nav\" aria-label=\"My Bible Explorer\">\n          <details class=\"mbe-library-menu\">\n            <summary class=\"mbe-library-toggle\">Library</summary>\n            <div class=\"mbe-library-panel\">\n              <div class=\"mbe-library-groups\">\n            <section class=\"mbe-library-group\" aria-labelledby=\"mbe-books-heading\">\n              <p class=\"mbe-library-heading\" id=\"mbe-books-heading\">Books of the Bible</p>\n              <div class=\"mbe-library-grid mbe-library-grid-books\">\n                <a class=\"mbe-library-item\" href=\"https://colossians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Colossians</span></a>\n                <a class=\"mbe-library-item\" href=\"https://corinthians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Corinthians</span></a>\n                <a class=\"mbe-library-item\" href=\"https://daniel.mybibleexplorer.com\"><span class=\"mbe-library-name\">Daniel</span></a>\n                <a class=\"mbe-library-item\" href=\"https://ephesians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Ephesians</span></a>\n                <a class=\"mbe-library-item\" href=\"https://galatians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Galatians</span></a>\n                <a class=\"mbe-library-item\" href=\"https://hebrews.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Hebrews</span></a>\n                <a class=\"mbe-library-item\" href=\"https://isaiah.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Isaiah</span></a>\n                <a class=\"mbe-library-item\" href=\"https://james.mybibleexplorer.com/\"><span class=\"mbe-library-name\">James</span></a>\n                <a class=\"mbe-library-item\" href=\"https://philippians.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Philippians</span></a>\n                <a class=\"mbe-library-item\" href=\"https://psalms.mybibleexplorer.com\"><span class=\"mbe-library-name\">Psalms</span></a>\n                <a class=\"mbe-library-item\" href=\"https://revelation.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Revelation</span></a>\n                <a class=\"mbe-library-item\" href=\"https://romans.mybibleexplorer.com\"><span class=\"mbe-library-name\">Romans</span></a>\n              </div>\n            </section>\n            <section class=\"mbe-library-group\" aria-labelledby=\"mbe-topics-heading\">\n              <p class=\"mbe-library-heading\" id=\"mbe-topics-heading\">Topics</p>\n              <div class=\"mbe-library-grid mbe-library-grid-topics\">\n                <a class=\"mbe-library-item\" href=\"https://stc.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Find Your Way Home</span></a>\n                <a class=\"mbe-library-item\" href=\"https://hermeneutics.mybibleexplorer.com\" aria-current=\"page\"><span class=\"mbe-library-name\">Hermeneutics</span></a>\n                <a class=\"mbe-library-item\" href=\"https://lastdayevents.mybibleexplorer.com/index.html\"><span class=\"mbe-library-name\">Last Day Events</span></a>\n                <a class=\"mbe-library-item\" href=\"https://christ.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Life of Christ</span></a>\n                <a class=\"mbe-library-item\" href=\"https://parables.mybibleexplorer.com\"><span class=\"mbe-library-name\">Parables</span></a>\n                <a class=\"mbe-library-item\" href=\"https://salvation.mybibleexplorer.com/\"><span class=\"mbe-library-name\">Salvation</span></a>\n                <a class=\"mbe-library-item\" href=\"https://sanctuary.mybibleexplorer.com/#structure\"><span class=\"mbe-library-name\">Sanctuary</span></a>\n              </div>\n            </section>\n          </div>\n            </div>\n          </details>\n          <a class=\"mbe-ribbon-give\" href=\"https://mybibleexplorer.com/#donate\">Support</a>\n        </nav>\n      </div>\n    </header>";
  const footerMarkup = "<footer class=\"mbe-global-footer\" data-tool=\"hermeneutics\">\n      <div class=\"mbe-shell-wrap mbe-footer-wrap\">\n        <a class=\"mbe-footer-brand\" href=\"https://mybibleexplorer.com\" aria-label=\"My Bible Explorer home\"><img class=\"mbe-footer-logo\" src=\"/assets/my-bible-explorer-logo.png?v=local-logo-1\" alt=\"My Bible Explorer\" width=\"107\" height=\"34\"></a>\n        <span>Know the Word. Live the Word.</span>\n        <span>To contact, email <a class=\"mbe-footer-link\" href=\"mailto:admin@mybibleexplorer.com\">admin@mybibleexplorer.com</a></span>\n        <a class=\"mbe-footer-link\" href=\"https://mybibleexplorer.com/#donate\">Support</a>\n        <span>&copy; <span data-mbe-year></span> My Bible Explorer</span>\n      </div>\n    </footer>\n    ";
  const dynamicControlLabels = [
    { label: "Select a Book", selector: "select" },
    { label: "Select an Epistle", selector: "select" },
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
