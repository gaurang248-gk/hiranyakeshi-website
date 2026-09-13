/**
 * HIRANYAKESHI AGROTECH PVT. LTD.
 * Premium Motion Design & Animation Engine
 *
 * PROGRESSIVE ENHANCEMENT ARCHITECTURE:
 * - Step 1 (synchronous, immediate): Add html.js-animations class so CSS
 *   can gate opacity:0 initial states. Without this class, all content is
 *   visible by default — animations are an enhancement, not a requirement.
 * - Step 2: On DOMContentLoaded, initialize all animation modules.
 * - Step 3: Safety fallback timeout (2s) reveals any still-hidden elements.
 */

// ─── STEP 1: Gate CSS animation states synchronously ─────────────────────────
var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion) {
  document.documentElement.classList.add('js-animations');
}

// ─── STEP 2: Initialize on DOM ready ─────────────────────────────────────────
(function () {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAllAnimations);
  } else {
    initAllAnimations();
  }

  function initAllAnimations() {
    initPageTransitions();
    initHeroCinematic();
    initScrollReveal();
    initStatCounters();
    initParallax();
    initCardMicroInteractions();
    initSafetyFallback();
  }

  /* --------------------------------------------------------------------------
     SAFETY FALLBACK — reveals all hidden elements after 2 seconds in case
     IntersectionObserver missed anything (above-fold elements, observer bugs)
     -------------------------------------------------------------------------- */
  function initSafetyFallback() {
    setTimeout(function () {
      document.querySelectorAll(
        '.reveal:not(.is-revealed), .stagger-item:not(.is-revealed), ' +
        '.reveal-heading:not(.is-revealed), .stagger-container:not(.is-revealed)'
      ).forEach(function (el) {
        el.classList.add('is-revealed');
        el.querySelectorAll('.stagger-item').forEach(function (item) {
          item.classList.add('is-revealed');
        });
      });
    }, 2000);
  }

  /* --------------------------------------------------------------------------
     1. Page Transitions (Smooth Fade In & Out)
     -------------------------------------------------------------------------- */
  function initPageTransitions() {
    if (prefersReducedMotion) {
      document.body.classList.add('no-motion');
      document.documentElement.classList.remove('js-animations');
      return;
    }

    requestAnimationFrame(function () {
      document.body.classList.add('page-ready');
    });

    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        document.body.classList.remove('page-fading-out');
        document.body.classList.add('page-ready');
      }
    });

    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) return;

      var href = link.getAttribute('href');
      var target = link.getAttribute('target');

      if (
        !href ||
        href.startsWith('#') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href.startsWith('javascript:') ||
        target === '_blank' ||
        link.hasAttribute('download') ||
        e.ctrlKey || e.metaKey || e.shiftKey
      ) {
        return;
      }

      try {
        var url = new URL(link.href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (
          url.pathname === window.location.pathname &&
          url.search === window.location.search &&
          url.hash
        ) return;

        e.preventDefault();
        document.body.classList.add('page-fading-out');
        setTimeout(function () {
          window.location.href = link.href;
        }, 200);
      } catch (err) { /* fallback normal navigation */ }
    });
  }

  /* --------------------------------------------------------------------------
     2. Hero Section Cinematic Entrance (Homepage only)
     -------------------------------------------------------------------------- */
  function initHeroCinematic() {
    var hero = document.getElementById('hero');
    if (!hero) return;

    if (prefersReducedMotion) {
      hero.classList.add('hero-visible');
      return;
    }

    setTimeout(function () {
      hero.classList.add('hero-animating');
    }, 80);
  }

  /* --------------------------------------------------------------------------
     3. Scroll-Reveal & Staggered Grids
     -------------------------------------------------------------------------- */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      document.querySelectorAll('.reveal, .reveal-heading, .stagger-item, .stagger-container').forEach(function (el) {
        el.classList.add('is-revealed');
        el.querySelectorAll('.stagger-item').forEach(function (item) {
          item.classList.add('is-revealed');
        });
      });
      return;
    }

    // Auto-assign stagger indexes to grid children
    var staggerGrids = document.querySelectorAll(
      '.stagger-container, .stagger-grid, .feature-grid-4, .products-grid, ' +
      '.stats-grid, .gallery-grid, .leadership-grid, .cert-grid, .blog-grid, ' +
      '.value-flow-grid, .support-grid'
    );

    staggerGrids.forEach(function (grid) {
      grid.classList.add('stagger-container');
      Array.from(grid.children)
        .filter(function (child) { return !child.classList.contains('no-stagger'); })
        .forEach(function (child, index) {
          child.classList.add('stagger-item');
          child.style.setProperty('--stagger-index', index);
        });
    });

    // rootMargin: small bottom offset only so above-fold elements immediately
    // trigger. The old -40px was causing top-of-page elements to never fire.
    var observerOptions = {
      root: null,
      rootMargin: '0px 0px -20px 0px',
      threshold: 0.05
    };

    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          el.classList.add('is-revealed');
          el.querySelectorAll('.stagger-item').forEach(function (item) {
            item.classList.add('is-revealed');
          });
          observer.unobserve(el);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal, .reveal-heading, .stagger-container').forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  /* --------------------------------------------------------------------------
     4. Stat Number Count-Up Animation
     -------------------------------------------------------------------------- */
  function initStatCounters() {
    var statElements = document.querySelectorAll('.stat-number');
    if (!statElements.length || prefersReducedMotion) return;

    var counterObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statElements.forEach(function (statEl) {
      var originalText = statEl.innerHTML;
      statEl.setAttribute('data-original-html', originalText);
      var rawText = statEl.textContent.trim();
      var match = rawText.match(/([0-9,]+)/);
      if (match) {
        var numStr = match[1].replace(/,/g, '');
        var targetNumber = parseInt(numStr, 10);
        if (!isNaN(targetNumber) && targetNumber > 0) {
          statEl.setAttribute('data-target-number', targetNumber);
          statEl.setAttribute('data-has-comma', match[1].includes(',') ? 'true' : 'false');
          statEl.innerHTML = originalText.replace(match[1], '0');
          counterObserver.observe(statEl);
        }
      }
    });

    function animateCounter(el) {
      var target = parseInt(el.getAttribute('data-target-number'), 10);
      var hasComma = el.getAttribute('data-has-comma') === 'true';
      var originalHTML = el.getAttribute('data-original-html');
      var match = originalHTML.match(/([0-9,]+)/);
      if (!match || isNaN(target)) return;

      var numberPlaceholder = match[1];
      var duration = 1800;
      var startTime = performance.now();

      function updateNumber(currentTime) {
        var elapsed = currentTime - startTime;
        var progress = Math.min(elapsed / duration, 1);
        var ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        var currentVal = Math.floor(ease * target);
        var formattedVal = hasComma ? currentVal.toLocaleString('en-IN') : currentVal.toString();
        el.innerHTML = originalHTML.replace(numberPlaceholder, formattedVal);
        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          el.innerHTML = originalHTML;
        }
      }
      requestAnimationFrame(updateNumber);
    }
  }

  /* --------------------------------------------------------------------------
     5. Parallax Scroll Effect (Desktop Only)
     -------------------------------------------------------------------------- */
  function initParallax() {
    if (prefersReducedMotion || window.innerWidth < 992) return;

    var heroBg = document.querySelector('.hero-bg-layer');
    var parallaxSections = document.querySelectorAll('.parallax-bg');

    if (!heroBg && !parallaxSections.length) return;

    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          if (heroBg && scrollY <= window.innerHeight * 1.2) {
            heroBg.style.transform = 'translate3d(0, ' + (scrollY * 0.28) + 'px, 0)';
          }
          parallaxSections.forEach(function (sec) {
            var rect = sec.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
              var offset = (window.innerHeight - rect.top) * 0.08;
              sec.style.backgroundPositionY = 'calc(50% + ' + offset + 'px)';
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /* --------------------------------------------------------------------------
     6. Card Micro-Interactions
     -------------------------------------------------------------------------- */
  function initCardMicroInteractions() {
    if (prefersReducedMotion) return;
    var cards = document.querySelectorAll(
      '.feature-box, .product-card, .value-flow-card, .leader-card, ' +
      '.cert-card, .blog-card, .support-card'
    );
    cards.forEach(function (card) {
      card.addEventListener('mouseenter', function () { card.classList.add('is-hovered'); });
      card.addEventListener('mouseleave', function () { card.classList.remove('is-hovered'); });
    });
  }

})();
