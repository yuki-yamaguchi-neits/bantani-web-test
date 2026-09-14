(() => {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const revealTargets = document.querySelectorAll([
    '#new-grave .works-heading',
    '#new-grave .works-build-slideshow',
    '#new-grave .works-archive',
    '#reform .works-heading',
    '#reform .works-repair-list',
    '#reform .works-repair-supplement',
    '#reform .works-archive',
    '#hakajimai .works-heading',
    '#hakajimai .works-close-note',
    '#hakajimai .works-close-grid',
    '#hakajimai .works-archive',
    '#stone-work .works-heading',
    '#stone-work .works-stone-showcase',
    '#stone-work .works-archive',
  ].join(','));

  revealTargets.forEach((target) => target.dataset.worksReveal = '');

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -12% 0px' });

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${Math.min(index % 3, 2) * 80}ms`;
      revealObserver.observe(target);
    });
  }

  const slideshow = document.querySelector('[data-build-slideshow]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (slideshow && !reduceMotion) {
    const slides = [...slideshow.querySelectorAll('.works-build-slide')];
    const label = slideshow.querySelector('h3[data-build-label]');
    const caption = slideshow.querySelector('p[data-build-caption]');
    const rail = slideshow.querySelector('.works-build-slideshow__rail');

    if (slides.length < 2 || !label || !caption || !rail) return;

    let activeIndex = 0;
    let timer;
    const moveDuration = 1200;
    const pauseDuration = 4200;

    const showSlide = (index) => {
      const currentSlide = slides[activeIndex];
      currentSlide.classList.remove('is-active');
      currentSlide.classList.add('is-leaving');
      activeIndex = index;
      slides[activeIndex].classList.add('is-active');
      label.textContent = slides[activeIndex].dataset.buildLabel;
      caption.textContent = slides[activeIndex].dataset.buildCaption;
      if (typeof rail.animate === 'function') {
        rail.animate(
          [{ opacity: .35, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: 650, easing: 'ease-out' }
        );
      }
      window.setTimeout(() => {
        currentSlide.classList.remove('is-leaving');
        currentSlide.classList.add('is-resetting');
        window.requestAnimationFrame(() => currentSlide.classList.remove('is-resetting'));
      }, moveDuration + 50);
    };

    const stop = () => window.clearTimeout(timer);
    const scheduleNext = (delay) => {
      timer = window.setTimeout(() => {
        showSlide((activeIndex + 1) % slides.length);
        scheduleNext(moveDuration + pauseDuration);
      }, delay);
    };
    const start = () => {
      stop();
      scheduleNext(pauseDuration);
    };

    start();
  }

  const stoneArchive = document.querySelector('[data-stone-archive]');
  if (stoneArchive) {
    const groups = [
      ['墓石洗浄・汚れ落とし', 'stone-cleaning-', [3, 4, 5, 6], 'gif'],
      ['字彫り・追加彫り', 'stone-inscription-', [2, 3, 4], 'gif'],
      ['ペットのお墓', 'stone-pet-grave-', [1, 2, 3, 4], 'jpg'],
      ['歌碑', 'stone-monument-', [1, 2, 3, 4, 5, 6], 'gif'],
      ['参道整備', 'stone-concrete-', [1, 2, 3, 4, 5, 6, 7], 'gif'],
      ['墓前灯籠', 'stone-garden-lantern-', [1], 'jpg'],
      ['石の補修・隙間補修', 'stone-repair-', ['before-02', 'detail-01', 'detail-02', 'detail-03', 'after-02'], 'gif'],
    ];
    const list = stoneArchive.parentElement;
    list.querySelectorAll(':scope > article').forEach((item) => { item.hidden = true; });
    groups.forEach(([title, prefix, items, extension]) => {
      const article = document.createElement('article');
      article.className = 'works-archive__item';
      const heading = document.createElement('h3');
      heading.textContent = title;
      const photos = document.createElement('div');
      photos.className = 'works-archive__photos';
      items.forEach((item) => {
        const number = typeof item === 'number' ? String(item).padStart(2, '0') : item;
        const source = `../../assets/images/lower/works/stone-work/${prefix}${number}.${extension}`;
        const button = document.createElement('button');
        button.className = 'works-image-button';
        button.type = 'button';
        button.dataset.worksImage = '';
        button.dataset.src = source;
        button.dataset.alt = title;
        const image = document.createElement('img');
        image.src = source;
        image.alt = title;
        image.loading = 'lazy';
        button.append(image);
        photos.append(button);
      });
      article.append(heading, photos);
      stoneArchive.append(article);
    });
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.works-archive').forEach((details) => {
      const summary = details.querySelector('summary');
      const content = details.querySelector('.works-archive__list');
      let animation;

      summary.addEventListener('click', (event) => {
        event.preventDefault();
        if (animation) animation.cancel();

        const closing = details.open;
        const startHeight = `${details.offsetHeight}px`;

        if (!closing) details.open = true;

        const endHeight = closing
          ? `${summary.offsetHeight}px`
          : `${details.offsetHeight}px`;

        details.style.height = startHeight;
        details.style.overflow = 'hidden';

        animation = details.animate(
          [{ height: startHeight }, { height: endHeight }],
          { duration: 420, easing: 'cubic-bezier(.22, .61, .36, 1)' }
        );

        content.animate(
          closing
            ? [{ opacity: 1, transform: 'translateY(0)' }, { opacity: 0, transform: 'translateY(-8px)' }]
            : [{ opacity: 0, transform: 'translateY(-8px)' }, { opacity: 1, transform: 'translateY(0)' }],
          { duration: closing ? 180 : 360, easing: 'ease-out' }
        );

        animation.onfinish = () => {
          details.open = !closing;
          details.style.height = '';
          details.style.overflow = '';
          animation = undefined;
        };
      });
    });
  }

  const modal = document.createElement('div');
  modal.className = 'works-image-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="works-image-modal__dialog" role="dialog" aria-modal="true" aria-label="施工画像">
      <button class="works-image-modal__close" type="button" aria-label="閉じる">×</button>
      <img class="works-image-modal__image" alt="">
    </div>`;
  document.body.append(modal);

  const modalImage = modal.querySelector('.works-image-modal__image');
  const closeModal = () => {
    modal.hidden = true;
    modalImage.removeAttribute('src');
  };

  document.querySelectorAll('[data-works-image]').forEach((button) => {
    button.addEventListener('click', () => {
      modalImage.src = button.dataset.src;
      modalImage.alt = button.dataset.alt;
      modal.hidden = false;
      modal.querySelector('.works-image-modal__close').focus();
    });
  });

  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.closest('.works-image-modal__close')) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
