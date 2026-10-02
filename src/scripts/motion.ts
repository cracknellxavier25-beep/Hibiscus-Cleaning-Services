/**
 * Site-wide motion. Runs only when <html> has the `motion` class (set in the
 * head when reduced motion isn't requested). All effects use transform and
 * opacity; observers stop watching elements once they've revealed.
 *
 *   [data-anim="lines"]  heading split into word masks, revealed line by line
 *   [data-anim="rise" | "pop" | "wipe"]  revealed when scrolled into view
 *   [data-stagger]       children with data-anim get staggered delays
 *   [data-tilt]          follows a fine pointer with a 3D tilt and sheen
 *   [data-hib="scroll"]  hibiscus blooms when in view
 *   .petals              drifting petals, paused off screen
 */

declare global {
  interface Window {
    __hibMotion?: boolean;
  }
}

const root = document.documentElement;

function splitLines(el: HTMLElement) {
  if (el.classList.contains('is-split')) return;
  // Split plain-text headings (optionally with <br>); anything else just rises.
  const nodes = Array.from(el.childNodes);
  if (nodes.some((n) => n.nodeType === 1 && (n as Element).tagName !== 'BR')) {
    el.classList.add('is-split');
    el.dataset.anim = 'rise';
    return;
  }
  el.setAttribute('aria-label', (el.textContent ?? '').replace(/\s+/g, ' ').trim());
  const holder = document.createElement('span');
  holder.setAttribute('aria-hidden', 'true');
  for (const node of nodes) {
    if (node.nodeType !== 3) {
      holder.append(document.createElement('br'));
      continue;
    }
    // Split on ordinary spaces only, so &nbsp; keeps words together.
    const words = (node.textContent ?? '').split(/[ \t\n\r]+/).filter(Boolean);
    words.forEach((word) => {
      const mask = document.createElement('span');
      mask.className = 'mask';
      const inner = document.createElement('span');
      inner.textContent = word;
      mask.append(inner);
      if (holder.lastChild && holder.lastChild.nodeName !== 'BR') holder.append(' ');
      holder.append(mask);
    });
  }
  el.replaceChildren(holder);
  setLineDelays(holder);
  el.classList.add('is-split');
}

/** Group words by rendered line so each line slides up together. */
function setLineDelays(holder: Element) {
  let line = -1;
  let lastTop = -Infinity;
  for (const m of Array.from(holder.querySelectorAll<HTMLElement>('.mask'))) {
    const top = m.offsetTop;
    if (top > lastTop + 4) {
      line++;
      lastTop = top;
    }
    m.style.setProperty('--ld', `${line * 110}ms`);
  }
}

function boot() {
  window.__hibMotion = true;
  const introActive = root.classList.contains('intro');
  // With the intro, content in view starts as the squeegee passes over it.
  const firstDelay = introActive ? 1000 : 60;
  const flowerDelay = introActive ? 1500 : 60;
  const bootTime = performance.now();

  document.querySelectorAll<HTMLElement>('[data-anim="lines"]').forEach(splitLines);
  // Web fonts can change where lines wrap; recompute once they're in.
  document.fonts?.ready.then(() =>
    document.querySelectorAll('[data-anim="lines"] > [aria-hidden]').forEach(setLineDelays),
  );

  document.querySelectorAll<HTMLElement>('[data-stagger]').forEach((group) => {
    const step = Number(group.dataset.stagger) || 90;
    group.querySelectorAll<HTMLElement>('[data-anim]').forEach((child, i) => {
      child.style.setProperty('--d', `${i * step}ms`);
      if (child.dataset.anim === 'pop' && !child.style.getPropertyValue('--pop-z')) {
        child.style.setProperty('--pop-z', `${i % 2 ? 4 : -4}deg`);
      }
    });
  });

  const reveal = (el: Element) => {
    const isFlower = el.matches('[data-hib]');
    const wait = performance.now() - bootTime < 400 ? (isFlower ? flowerDelay : firstDelay) : 0;
    window.setTimeout(() => el.classList.add(isFlower ? 'is-bloom' : 'is-in'), wait);
  };

  const targets = document.querySelectorAll<HTMLElement>('[data-anim], [data-hib="scroll"]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          reveal(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    targets.forEach((t) => io.observe(t));
  } else {
    targets.forEach(reveal);
  }

  // Pause looping decoration while it's off screen.
  if ('IntersectionObserver' in window) {
    const pauser = new IntersectionObserver((entries) => {
      for (const e of entries) e.target.classList.toggle('is-paused', !e.isIntersecting);
    });
    document.querySelectorAll('.petals, .hib').forEach((el) => pauser.observe(el));
    document.addEventListener('visibilitychange', () => {
      document.querySelectorAll('.petals, .hib').forEach((el) => el.classList.toggle('is-paused', document.hidden));
    });
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!finePointer) return;

  // 3D tilt on cards.
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    let rect: DOMRect | null = null;
    let raf = 0;
    const max = Number(card.dataset.tilt) || 7;
    card.addEventListener('pointerenter', () => {
      rect = card.getBoundingClientRect();
      card.classList.add('is-tilting');
    });
    card.addEventListener('pointermove', (e) => {
      if (!rect || raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        if (!rect) return;
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        card.style.setProperty('--tx', `${(x - 0.5) * 2 * max}deg`);
        card.style.setProperty('--ty', `${(0.5 - y) * 2 * max}deg`);
        card.style.setProperty('--gx', `${x * 100}%`);
        card.style.setProperty('--gy', `${y * 100}%`);
      });
    });
    card.addEventListener('pointerleave', () => {
      rect = null;
      card.classList.remove('is-tilting');
      card.style.setProperty('--tx', '0deg');
      card.style.setProperty('--ty', '0deg');
    });
  });

  // The hero hibiscus leans towards the pointer; layers at different depths give parallax.
  document.querySelectorAll<HTMLElement>('[data-hib-interactive]').forEach((flower) => {
    const zone = flower.closest<HTMLElement>('[data-hib-zone]') ?? flower;
    let raf = 0;
    zone.addEventListener('pointermove', (e) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const r = flower.getBoundingClientRect();
        const x = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.8)));
        const y = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.8)));
        flower.style.setProperty('--ry', `${x * 22}deg`);
        flower.style.setProperty('--rx', `${-y * 18}deg`);
      });
    });
    zone.addEventListener('pointerleave', () => {
      flower.style.setProperty('--ry', '0deg');
      flower.style.setProperty('--rx', '0deg');
    });
  });
}

if (root.classList.contains('motion')) {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
}

export {};
