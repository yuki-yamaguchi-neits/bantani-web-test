(() => {
  const links = Array.from(document.querySelectorAll(".bk-toc a"));
  const sections = links
    .map((link) => {
      const id = link.getAttribute("href");
      return id ? document.querySelector(id) : null;
    })
    .filter(Boolean);

  if (!links.length || !sections.length || !("IntersectionObserver" in window)) {
    return;
  }

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.id) {
        setActive(visible.target.id);
      }
    },
    {
      rootMargin: "-18% 0px -58% 0px",
      threshold: [0.18, 0.4, 0.65]
    }
  );

  sections.forEach((section) => observer.observe(section));
})();

(() => {
  const section = document.querySelector("#bk-good-grave");
  if (!section) return;

  const images = Array.from(section.querySelectorAll("[data-good-grave-image]"));
  const links = Array.from(section.querySelectorAll("[data-good-grave-step]"));
  if (!images.length || !links.length) return;

  const showImage = (key) => {
    images.forEach((image) => {
      image.classList.toggle("is-active", image.dataset.goodGraveImage === key);
    });
    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.goodGraveStep === key);
    });
  };

  links.forEach((link) => {
    const activate = () => showImage(link.dataset.goodGraveStep);
    link.addEventListener("pointerenter", activate);
    link.addEventListener("focus", activate);
  });

  // On a phone, let the selected image register before leaving for its detail page.
  // Desktop hover and keyboard navigation remain immediate.
  const usesTouchPrimaryInput = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  if (usesTouchPrimaryInput) {
    let isNavigating = false;

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        if (isNavigating || event.defaultPrevented || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
          return;
        }

        event.preventDefault();
        isNavigating = true;
        showImage(link.dataset.goodGraveStep);

        window.setTimeout(() => {
          window.location.assign(link.href);
        }, 360);
      });
    });
  }

  const initial = images.find((image) => image.classList.contains("is-active"));
  if (initial) showImage(initial.dataset.goodGraveImage);
})();
