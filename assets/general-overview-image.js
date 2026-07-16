(() => {
  const marker = "__generalOverviewDetectiveImage_v1";
  if (window[marker]) return;
  window[marker] = true;

  const imageSrc = "/assets/detective-method-caseboard.png?v=special-navy-cards-1";
  const imageAlt =
    "An open Bible studied like an investigation, with notes, a magnifying glass, and a careful case-board scene.";

  function findHeading() {
    return Array.from(document.querySelectorAll("#root main h1, #root main h2, #root main h3")).find(
      (heading) =>
        heading.textContent &&
        heading.textContent.trim() === "The Detective Method" &&
        !heading.closest("nav, header, footer")
    );
  }

  function ensureImage() {
    const heading = findHeading();
    const existing = document.querySelector(".general-detective-picture");

    if (!heading) {
      if (existing) existing.remove();
      return;
    }

    if (existing && existing.previousElementSibling === heading) return;
    if (existing) existing.remove();

    const figure = document.createElement("figure");
    figure.className = "general-detective-picture";

    const image = document.createElement("img");
    image.src = imageSrc;
    image.alt = imageAlt;
    image.width = 1718;
    image.height = 916;
    image.loading = "eager";
    image.decoding = "async";

    figure.appendChild(image);
    heading.insertAdjacentElement("afterend", figure);
  }

  let queued = false;
  function queueEnsure() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      ensureImage();
    });
  }

  window.addEventListener("DOMContentLoaded", queueEnsure);
  window.addEventListener("hashchange", queueEnsure);
  window.addEventListener("popstate", queueEnsure);
  new MutationObserver(queueEnsure).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  queueEnsure();
})();
