(() => {
  const root = document.querySelector(".bantani-home");
  if (!root) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const supportsObserver = "IntersectionObserver" in window;

  const initHeroIntro = () => {
    const titleParts = root.querySelectorAll(".hm-hero__title-col");
    const leadLines = root.querySelectorAll(".hm-hero__lead, .hm-hero__micro");
    if (!titleParts.length || !leadLines.length) return;

    root.classList.add("is-hero-intro-ready");

    let leadIndex = 0;
    leadLines.forEach((line) => {
      const text = line.textContent || "";
      line.setAttribute("aria-label", text);
      line.textContent = "";
      Array.from(text).forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.setProperty("--hm-char-index", String(leadIndex));
        line.appendChild(span);
        leadIndex += 1;
      });
    });
  };

  const splitTextToSpans = (elements, indexPrefix = 0) => {
    let charIndex = indexPrefix;
    elements.forEach((line) => {
      const text = line.textContent || "";
      line.setAttribute("aria-label", text);
      line.textContent = "";
      Array.from(text).forEach((char) => {
        const span = document.createElement("span");
        span.textContent = char;
        span.style.setProperty("--hm-char-index", String(charIndex));
        line.appendChild(span);
        charIndex += 1;
      });
    });
  };

  const initAboutIntro = () => {
    const about = root.querySelector(".hm-about--final");
    if (!about) return;

    const messageLines = about.querySelectorAll(".hm-about-final__message-col");
    if (messageLines.length) splitTextToSpans(messageLines);

    if (reduceMotion || !supportsObserver) {
      about.classList.add("is-about-motion-visible");
      return;
    }

    about.classList.add("is-about-motion-ready");
    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-about-motion-visible");
          aboutObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -18%", threshold: 0.18 });

    aboutObserver.observe(about);
  };

  const initHeroSlides = () => {
    const hero = root.querySelector(".hm-hero");
    const slides = Array.from(root.querySelectorAll("[data-hm-slide]"));
    const exitTimers = new WeakMap();
    let activeSlide = 0;

    const setSlide = (index) => {
      if (!slides.length) return;
      const previousSlide = slides[activeSlide];
      activeSlide = index % slides.length;
      const nextSlide = slides[activeSlide];
      hero?.setAttribute("data-hm-slide-active", String(activeSlide));

      slides.forEach((slide, slideIndex) => {
        const isNext = slideIndex === activeSlide;
        if (!isNext && slide !== previousSlide) {
          slide.classList.remove("is-active", "is-exiting");
          slide.setAttribute("aria-hidden", "true");
        }
      });

      if (previousSlide && previousSlide !== nextSlide) {
        const oldTimer = exitTimers.get(previousSlide);
        if (oldTimer) window.clearTimeout(oldTimer);
        previousSlide.classList.remove("is-active");
        previousSlide.classList.add("is-exiting");
        previousSlide.setAttribute("aria-hidden", "true");
        const exitTimer = window.setTimeout(() => {
          previousSlide.classList.remove("is-exiting");
          exitTimers.delete(previousSlide);
        }, 1220);
        exitTimers.set(previousSlide, exitTimer);
      }

      if (nextSlide) {
        const nextExitTimer = exitTimers.get(nextSlide);
        if (nextExitTimer) {
          window.clearTimeout(nextExitTimer);
          exitTimers.delete(nextSlide);
        }
        nextSlide.classList.remove("is-exiting");
        nextSlide.classList.add("is-active");
        nextSlide.setAttribute("aria-hidden", "false");
        if (!reduceMotion) {
          nextSlide.style.animation = "none";
          nextSlide.offsetHeight;
          nextSlide.style.animation = "";
        }
      }

    };

    if (!slides.length) return;
    setSlide(0);
    if (!reduceMotion && slides.length > 1) {
      window.setInterval(() => setSlide(activeSlide + 1), 8000);
    }
  };

  const initReveal = () => {
    const targets = root.querySelectorAll(
      ".hm-feature__copy, .hm-feature__proof, .hm-works__head, .hm-works__gallery, .hm-knowledge__grid > *, .hm-contact__copy, .hm-contact__panel"
    );

    targets.forEach((target) => target.setAttribute("data-hm-reveal", ""));

    if (reduceMotion || !supportsObserver) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -18%", threshold: 0.08 });

    targets.forEach((target) => observer.observe(target));
  };

  const initServicesGuideMotion = () => {
    const servicesGuide = root.querySelector(".hm-services--guide");
    if (!servicesGuide) return;

    const leadLines = servicesGuide.querySelectorAll(".hm-services-guide__lead > span");
    if (leadLines.length && !servicesGuide.dataset.hmLeadSplit) {
      splitTextToSpans(leadLines);
      servicesGuide.dataset.hmLeadSplit = "true";
    }

    const serviceItems = servicesGuide.querySelectorAll(".hm-services-guide__list p");
    serviceItems.forEach((item, index) => {
      item.style.setProperty("--hm-service-motion-index", String(index));
    });

    if (reduceMotion || !supportsObserver) {
      servicesGuide.classList.add("is-motion-visible");
      return;
    }

    servicesGuide.classList.add("is-motion-ready");
    const servicesObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-motion-visible");
          servicesObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px", threshold: 0.24 });

    servicesObserver.observe(servicesGuide);
  };

  const initScrollEffects = () => {
    const hero = root.querySelector(".hm-hero");
    const motionPhotos = root.querySelectorAll(".hm-feature__photo");

    const updateScrollState = () => {
      const y = window.scrollY || window.pageYOffset || 0;
      if (!reduceMotion && hero) {
        const shift = Math.min(32, Math.max(0, y * 0.04));
        root.style.setProperty("--hm-hero-shift", `${shift.toFixed(2)}px`);
      }
      if (!reduceMotion) {
        motionPhotos.forEach((photo) => {
          const rect = photo.getBoundingClientRect();
          const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight));
          photo.style.setProperty("--hm-photo-shift", `${(-progress * 24).toFixed(2)}px`);
        });
      }
    };

    updateScrollState();
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
  };


  initHeroIntro();
  initAboutIntro();
  initHeroSlides();
  initReveal();
  initServicesGuideMotion();
  initScrollEffects();
})();
