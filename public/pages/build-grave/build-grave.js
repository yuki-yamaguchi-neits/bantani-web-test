(() => {
  const splitStyleTheme = (element) => {
    if (!element || element.dataset.bgTextSplit === 'true') return;
    const label = element.textContent || '';
    const nodes = Array.from(element.childNodes);
    let charIndex = 0;

    element.setAttribute('aria-label', label);
    element.textContent = '';

    nodes.forEach((node) => {
      if (node.nodeName === 'BR') {
        element.appendChild(document.createElement('br'));
        return;
      }
      Array.from(node.textContent || '').forEach((char) => {
        const span = document.createElement('span');
        span.className = 'bg-style-theme__char';
        span.textContent = char;
        span.style.setProperty('--bg-char-index', String(charIndex));
        element.appendChild(span);
        charIndex += 1;
      });
    });

    element.dataset.bgTextSplit = 'true';
  };

  document
    .querySelectorAll('.bg-style-theme__col')
    .forEach(splitStyleTheme);

  const items = document.querySelectorAll('.reveal-item');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      if (entry.target.matches('#build-style, #build-stone')) {
        entry.target.classList.add('is-style-motion-visible');
      }
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('#build-style, #build-stone').forEach((section) => {
    section.classList.add('is-style-motion-ready');
    observer.observe(section);
  });

  items.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 80}ms`;
    observer.observe(item);
  });

  const flowSection = document.querySelector('#build-flow');
  if (flowSection) {
    const flowImages = Array.from(flowSection.querySelectorAll('[data-flow-image]'));
    const flowSteps = Array.from(flowSection.querySelectorAll('[data-flow-step]'));
    const flowCaption = flowSection.querySelector('[data-flow-caption]');

    const selectFlowStep = (key, caption) => {
      const nextImage = flowImages.find((image) => image.dataset.flowImage === key);
      if (!nextImage) return;

      flowImages.forEach((image) => image.classList.toggle('is-active', image === nextImage));
      flowSteps.forEach((step) => step.setAttribute('aria-pressed', String(step.dataset.flowStep === key)));
      if (flowCaption) flowCaption.textContent = caption;
    };

    flowSteps.forEach((step) => {
      const activate = () => selectFlowStep(step.dataset.flowStep, step.dataset.flowCaption);
      step.addEventListener('pointerenter', activate);
      step.addEventListener('focus', activate);
      step.addEventListener('click', activate);
    });
  }

  const stoneMore = document.querySelector('.bg-stone-more');
  if (!stoneMore || !stoneMore.querySelector('summary')) return;

  const stoneSummary = stoneMore.querySelector('summary');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stoneAnimation;

  const animateStoneMore = (open) => {
    if (reduceMotion) {
      stoneMore.open = open;
      return;
    }

    stoneAnimation?.cancel();
    const startHeight = stoneMore.offsetHeight;

    if (open) stoneMore.open = true;
    const endHeight = open ? stoneMore.offsetHeight : stoneSummary.offsetHeight;

    stoneAnimation = stoneMore.animate(
      { height: [`${startHeight}px`, `${endHeight}px`] },
      { duration: 620, easing: 'cubic-bezier(.22, 1, .36, 1)' },
    );

    stoneAnimation.onfinish = () => {
      stoneMore.style.height = '';
      if (!open) stoneMore.open = false;
      stoneAnimation = undefined;
    };
  };

  stoneSummary.addEventListener('click', (event) => {
    event.preventDefault();
    animateStoneMore(!stoneMore.open);
  });
})();
