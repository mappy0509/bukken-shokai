(function () {
  'use strict';

  const tabs = Array.from(document.querySelectorAll('.tab'));
  const sections = Array.from(document.querySelectorAll('.property'));
  const ids = sections.map(s => s.id);
  const bnCur = document.querySelector('.bn-cur');
  const bnButtons = document.querySelectorAll('.bn-btn');

  let current = 0;

  function setActive(index, scrollTop = true) {
    if (index < 0) index = 0;
    if (index > sections.length - 1) index = sections.length - 1;
    current = index;

    tabs.forEach((t, i) => t.classList.toggle('active', i === index));
    sections.forEach((s, i) => s.classList.toggle('active', i === index));

    if (bnCur) bnCur.textContent = String(index + 1);

    if (scrollTop) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (history.replaceState) {
      history.replaceState(null, '', '#' + ids[index]);
    }
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => setActive(i));
  });

  bnButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action === 'next') setActive(current + 1);
      if (action === 'prev') setActive(current - 1);
    });
  });

  // ===== Initial route from hash =====
  function routeFromHash() {
    const id = location.hash.replace('#', '');
    const idx = ids.indexOf(id);
    if (idx >= 0) setActive(idx, false);
  }
  routeFromHash();
  window.addEventListener('hashchange', routeFromHash);

  // ===== Swipe support (left/right) =====
  let touchStartX = 0;
  let touchStartY = 0;
  let touchActive = false;

  document.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchActive = true;
  }, { passive: true });

  document.addEventListener('touchend', (e) => {
    if (!touchActive) return;
    touchActive = false;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    // Only horizontal swipes that are clearly horizontal
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx) * 0.7) return;

    // Avoid swipes that started inside a horizontally scrollable area
    const target = e.target.closest('.table-scroll');
    if (target) return;

    if (dx < 0) setActive(current + 1);
    else setActive(current - 1);
  }, { passive: true });

  // ===== Keyboard arrows (desktop nice-to-have) =====
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') setActive(current + 1);
    if (e.key === 'ArrowLeft') setActive(current - 1);
  });
})();
