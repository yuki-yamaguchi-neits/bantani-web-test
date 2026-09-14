(() => {
  const initLowerPageGuides = () => {
    const guides = document.querySelectorAll(".lower-page-guide");
    if (!guides.length) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const reveal = (guide) => guide.classList.add("is-guide-motion-visible");

    guides.forEach((guide) => {
      const title = guide.querySelector(".lower-page-guide__title");
      if (title && !title.dataset.guideSplit) {
        const fragment = document.createDocumentFragment();
        let index = 0;
        [...title.childNodes].forEach((node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            [...node.textContent].forEach((character) => {
              const span = document.createElement("span");
              span.textContent = character === " " ? "\u00a0" : character;
              span.style.setProperty("--lower-guide-char-index", String(index++));
              fragment.append(span);
            });
          } else if (node.nodeName === "BR") {
            fragment.append(document.createElement("br"));
          } else {
            fragment.append(node.cloneNode(true));
          }
        });
        title.replaceChildren(fragment);
        title.dataset.guideSplit = "true";
      }

      if (reduceMotion || !("IntersectionObserver" in window)) {
        reveal(guide);
        return;
      }

      const observer = new IntersectionObserver((entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          reveal(entry.target);
          currentObserver.unobserve(entry.target);
        });
      }, { threshold: .2 });
      observer.observe(guide);
    });
  };

  initLowerPageGuides();
  const header = document.querySelector("[data-site-header]");
  const menuButton = document.querySelector("[data-menu-button]");
  const drawer = document.querySelector("[data-site-drawer]");
  const hero = document.querySelector("[data-header-hero]");

  if (!header) return;

  const setHeroState = () => {
    const headerHeight = header.offsetHeight || 0;
    const overHero = hero ? hero.getBoundingClientRect().bottom > headerHeight + 12 : false;
    header.classList.toggle("is-over-hero", overHero);
    header.classList.toggle("is-scrolled", !overHero);
  };

  setHeroState();
  window.addEventListener("scroll", setHeroState, { passive: true });
  window.addEventListener("resize", setHeroState);

  if (!menuButton || !drawer) return;

  const closeMenu = ({ restoreFocus = false } = {}) => {
    menuButton.setAttribute("aria-expanded", "false");
    drawer.classList.remove("is-open");
    drawer.setAttribute("hidden", "");
    document.body.classList.remove("is-menu-open");
    if (restoreFocus) menuButton.focus();
  };

  const openMenu = () => {
    menuButton.setAttribute("aria-expanded", "true");
    drawer.removeAttribute("hidden");
    drawer.classList.add("is-open");
    document.body.classList.add("is-menu-open");
  };

  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  drawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => closeMenu());
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu({ restoreFocus: true });
    }
  });

  document.addEventListener("click", (event) => {
    if (
      menuButton.getAttribute("aria-expanded") !== "true" ||
      drawer.contains(event.target) ||
      menuButton.contains(event.target)
    ) {
      return;
    }
    closeMenu();
  });
})();
