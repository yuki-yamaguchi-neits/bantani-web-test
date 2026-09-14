(() => {
  "use strict";

  const concerns = document.querySelector("#repair-concerns");
  if (!concerns) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const splitTextToSpans = (element) => {
    if (!element || element.dataset.rcTextSplit === "true") return;

    const nodes = Array.from(element.childNodes);
    const label = element.textContent || "";
    let charIndex = 0;

    element.setAttribute("aria-label", label);
    element.textContent = "";

    nodes.forEach((node) => {
      if (node.nodeName === "BR") {
        element.appendChild(document.createElement("br"));
        return;
      }

      Array.from(node.textContent || "").forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.setProperty("--rc-path-char-index", String(charIndex));
        element.appendChild(span);
        charIndex += 1;
      });
    });

    element.dataset.rcTextSplit = "true";
  };

  concerns.querySelectorAll(".rc-concerns__photo figcaption > span").forEach(splitTextToSpans);

  if (reduceMotion || !("IntersectionObserver" in window)) {
    concerns.classList.add("is-concerns-motion-visible");
    return;
  }

  concerns.classList.add("is-concerns-motion-ready");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      window.setTimeout(() => entry.target.classList.add("is-concerns-motion-visible"), 240);
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -14%",
    threshold: 0.16,
  });

  observer.observe(concerns);
})();

(() => {
  "use strict";

  const sections = [
    document.querySelector("#repair-small"),
    document.querySelector("#repair-relocation"),
    document.querySelector("#repair-closeout"),
  ].filter(Boolean);

  if (!sections.length) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || !("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-section-motion-visible"));
    return;
  }

  sections.forEach((section) => section.classList.add("rc-section-motion-ready"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      window.setTimeout(() => entry.target.classList.add("is-section-motion-visible"), 140);
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12%",
    threshold: 0.14,
  });

  sections.forEach((section) => observer.observe(section));
})();

(() => {
  "use strict";

  const relocationMore = document.querySelector("#repair-relocation .rc-relocation-more");
  if (!relocationMore || !relocationMore.querySelector("summary")) return;

  const summary = relocationMore.querySelector("summary");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let animation;

  const animateDetails = (open) => {
    if (reduceMotion) {
      relocationMore.open = open;
      return;
    }

    animation?.cancel();
    const startHeight = relocationMore.offsetHeight;
    if (open) relocationMore.open = true;
    const endHeight = open ? relocationMore.offsetHeight : summary.offsetHeight;
    relocationMore.style.overflow = "hidden";

    animation = relocationMore.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 620, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );

    animation.onfinish = () => {
      relocationMore.style.height = "";
      relocationMore.style.overflow = "";
      if (!open) relocationMore.open = false;
      animation = undefined;
    };
  };

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    animateDetails(!relocationMore.open);
  });
})();

(() => {
  "use strict";

  const maintenanceMore = document.querySelector("#repair-small .rc-maintenance-more");
  if (!maintenanceMore || !maintenanceMore.querySelector("summary")) return;

  const summary = maintenanceMore.querySelector("summary");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let animation;

  const animateDetails = (open) => {
    if (reduceMotion) {
      maintenanceMore.open = open;
      return;
    }

    animation?.cancel();
    const startHeight = maintenanceMore.offsetHeight;
    if (open) maintenanceMore.open = true;
    const endHeight = open ? maintenanceMore.offsetHeight : summary.offsetHeight;
    maintenanceMore.style.overflow = "hidden";

    animation = maintenanceMore.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 620, easing: "cubic-bezier(.22, 1, .36, 1)" },
    );

    animation.onfinish = () => {
      maintenanceMore.style.height = "";
      maintenanceMore.style.overflow = "";
      if (!open) maintenanceMore.open = false;
      animation = undefined;
    };
  };

  summary.addEventListener("click", (event) => {
    event.preventDefault();
    animateDetails(!maintenanceMore.open);
  });
})();

(() => {
  "use strict";

  const reform = document.querySelector("#repair-reform");
  if (!reform) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const verticalLead = reform.querySelector(".rc-reform__vertical-lead");

  if (verticalLead && verticalLead.dataset.rcTextSplit !== "true") {
    const label = verticalLead.textContent || "";
    verticalLead.setAttribute("aria-label", label);
    verticalLead.textContent = "";

    Array.from(label).forEach((char, index) => {
      const span = document.createElement("span");
      span.textContent = char;
      span.style.setProperty("--rc-reform-char-index", String(index));
      verticalLead.appendChild(span);
    });

    verticalLead.dataset.rcTextSplit = "true";
  }

  if (reduceMotion || !("IntersectionObserver" in window)) {
    reform.classList.add("is-reform-motion-visible");
    return;
  }

  reform.classList.add("is-reform-motion-ready");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      window.setTimeout(() => entry.target.classList.add("is-reform-motion-visible"), 140);
      observer.unobserve(entry.target);
    });
  }, {
    rootMargin: "0px 0px -12%",
    threshold: 0.14,
  });

  observer.observe(reform);
})();
