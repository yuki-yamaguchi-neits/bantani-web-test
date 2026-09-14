(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsObserver = "IntersectionObserver" in window;

  const observeOnce = (section, readyClass, visibleClass, options) => {
    if (!section) return;

    if (reduceMotion || !supportsObserver) {
      section.classList.add(visibleClass);
      return;
    }

    section.classList.add(readyClass);

    const show = () => {
      section.classList.add(visibleClass);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          window.setTimeout(show, options?.delayVisible || 0);
          observer.unobserve(entry.target);
        }
      });
    }, options);

    observer.observe(section);
  };

  const splitTextToSpans = (element) => {
    if (!element || element.dataset.aboutTextSplit === "true") return;

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
        span.style.setProperty("--about-char-index", String(charIndex));
        element.appendChild(span);
        charIndex += 1;
      });
    });

    element.dataset.aboutTextSplit = "true";
  };

  observeOnce(document.querySelector(".about-owner"), "is-owner-motion-ready", "is-owner-motion-visible", {
    rootMargin: "0px 0px -14%",
    threshold: 0.16,
    delayVisible: 180,
  });

  const think = document.querySelector(".about-think");
  splitTextToSpans(think?.querySelector(".about-think__lead"));
  observeOnce(think, "is-think-motion-ready", "is-think-motion-visible", {
    rootMargin: "0px 0px -16%",
    threshold: 0.16,
  });

  observeOnce(document.querySelector(".about-quality"), "is-quality-motion-ready", "is-quality-motion-visible", {
    rootMargin: "0px 0px -16%",
    threshold: 0.14,
  });

  observeOnce(document.querySelector(".about-consult"), "is-consult-motion-ready", "is-consult-motion-visible", {
    rootMargin: "0px 0px -10%",
    threshold: 0.08,
  });
})();
