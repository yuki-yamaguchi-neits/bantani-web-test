(() => {
  // Single source of truth for the issued GA4 measurement ID.
  const measurementId = 'G-E165X8J3MW';
  if (!measurementId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!link) return;

    if (link.href.startsWith('tel:')) {
      window.gtag('event', 'click_phone', { link_url: link.href });
      return;
    }

    if (/(?:^|\/)contact(?:\/|$)|pages\/contact/.test(link.getAttribute('href'))) {
      window.gtag('event', 'contact_cta_click', { link_url: link.href });
    }
  });
})();
