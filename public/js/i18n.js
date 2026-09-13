/**
 * HIRANYAKESHI AGROTECH PVT. LTD.
 * Internationalization (i18n) Engine - English & Marathi (मराठी)
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'preferred_language';
  const DEFAULT_LANG = 'en';

  // Get current language from localStorage or default
  function getCurrentLanguage() {
    try {
      return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    } catch (e) {
      return DEFAULT_LANG;
    }
  }

  // Get translation by dot-separated path e.g. "common.nav_home" or direct key
  function getTranslation(key, lang) {
    if (!window.TRANSLATIONS) return null;

    // Check if key is formatted as "section.subKey"
    if (key.includes('.')) {
      const parts = key.split('.');
      let current = window.TRANSLATIONS;
      for (const part of parts) {
        if (!current) return null;
        current = current[part];
      }
      if (current && typeof current === 'object' && current[lang]) {
        return current[lang];
      }
      return current;
    }

    // Search across all translation modules (common, forms, home, etc.)
    for (const moduleName in window.TRANSLATIONS) {
      const module = window.TRANSLATIONS[moduleName];
      if (module && module[lang] && module[lang][key] !== undefined) {
        return module[lang][key];
      }
    }

    return null;
  }

  // Switch and apply language
  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'mr') lang = 'en';

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Could not save language preference to localStorage:', e);
    }

    // Set HTML lang attribute and body class
    document.documentElement.lang = lang;
    if (lang === 'mr') {
      document.documentElement.classList.add('lang-mr');
      document.body?.classList.add('lang-mr');
    } else {
      document.documentElement.classList.remove('lang-mr');
      document.body?.classList.remove('lang-mr');
    }

    // Update Language Switcher UI elements (Desktop & Mobile)
    updateSwitcherUI(lang);

    // Apply translations across DOM
    applyDOMTranslations(lang);

    // Re-render or update Shared Footer
    updateSharedFooter(lang);

    // Dispatch global languageChanged event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  // Apply translations to all marked elements
  function applyDOMTranslations(lang) {
    // 1. Text content: data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = getTranslation(key, lang);
      if (val !== null) {
        el.textContent = val;
      }
    });

    // 2. HTML content: data-i18n-html
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      const val = getTranslation(key, lang);
      if (val !== null) {
        el.innerHTML = val;
      }
    });

    // 3. Placeholders: data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const val = getTranslation(key, lang);
      if (val !== null) {
        el.placeholder = val;
      }
    });

    // 4. Titles/Aria: data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = getTranslation(key, lang);
      if (val !== null) {
        el.title = val;
      }
    });

    // 5. Value attributes (e.g. submit buttons): data-i18n-value
    document.querySelectorAll('[data-i18n-value]').forEach(el => {
      const key = el.getAttribute('data-i18n-value');
      const val = getTranslation(key, lang);
      if (val !== null) {
        el.value = val;
      }
    });

    // 6. Navigation standard links (Desktop & Mobile)
    translateStandardNav(lang);

    // 7. Dynamic Form labels & options
    translateFormElements(lang);
  }

  // Automatic translation for standard navigation items across all pages
  function translateStandardNav(lang) {
    const navMap = [
      { selector: 'a[href="/"].nav-link, a[href="/"].mobile-nav-link', key: 'nav_home' },
      { selector: '.has-dropdown > .dropdown-toggle', key: 'nav_about_us', matchText: 'About Us' },
      { selector: '.has-dropdown:nth-of-type(2) > .dropdown-toggle', key: 'nav_what_we_do', matchText: 'What We Do' },
      { selector: '.has-dropdown:nth-of-type(3) > .dropdown-toggle', key: 'nav_products', matchText: 'Products' },
      { selector: 'a[href="/about"]', key: 'nav_about_us' },
      { selector: 'a[href="/infrastructure"]', key: 'nav_infrastructure' },
      { selector: 'a[href="/quality"]', key: 'nav_quality' },
      { selector: 'a[href="/sustainability"]', key: 'nav_sustainability' },
      { selector: 'a[href="/value-chain"]', key: 'nav_value_chain' },
      { selector: 'a[href="/products"].dropdown-item, a[href="/products"].mobile-submenu-link', key: 'nav_products' },
      { selector: 'a[href="/export-b2b"]', key: 'nav_export_b2b' },
      { selector: 'a[href="/for-farmers"]', key: 'nav_for_farmers' },
      { selector: 'a[href="/blog"]', key: 'nav_blog' },
      { selector: 'a[href="/contact"].nav-cta-btn, a[href="/contact"].btn-accent', key: 'nav_contact' },
      { selector: 'a[href="/contact"].mobile-nav-link', key: 'nav_contact_short' },
      { selector: 'a[href="/admin"]', key: 'nav_admin' }
    ];

    navMap.forEach(item => {
      const elements = document.querySelectorAll(item.selector);
      elements.forEach(el => {
        // If element has svg icon inside dropdown toggle, preserve svg
        const svg = el.querySelector('svg');
        const translated = getTranslation(item.key, lang);
        if (translated) {
          if (svg) {
            el.innerHTML = `${translated} ${svg.outerHTML}`;
          } else {
            // Check if element has span inside (mobile toggle)
            const innerSpan = el.querySelector('span');
            if (innerSpan) {
              innerSpan.textContent = translated;
            } else {
              el.textContent = translated;
            }
          }
        }
      });
    });

    // Mobile dropdown toggle headers
    document.querySelectorAll('.mobile-dropdown-toggle span').forEach(span => {
      const text = span.textContent.trim();
      if (text === 'About Us' || text === 'आमच्याबद्दल') {
        span.textContent = getTranslation('nav_about_us', lang) || text;
      } else if (text === 'What We Do' || text === 'आम्ही काय करतो') {
        span.textContent = getTranslation('nav_what_we_do', lang) || text;
      } else if (text === 'Products' || text === 'उत्पादने') {
        span.textContent = getTranslation('nav_products', lang) || text;
      }
    });
  }

  // Translate form labels, placeholders, select options
  function translateFormElements(lang) {
    // Contact & B2B & Farmer forms
    const categorySelect = document.getElementById('category');
    if (categorySelect) {
      Array.from(categorySelect.options).forEach(opt => {
        const val = opt.value;
        if (val === 'General Inquiry') opt.text = getTranslation('form_category_general', lang);
        else if (val.includes('Bulk') || val.includes('Wholesale') || val.includes('घाऊक')) opt.text = getTranslation('form_category_b2b', lang);
        else if (val.includes('Export') || val.includes('निर्यात')) opt.text = getTranslation('form_category_export', lang);
        else if (val.includes('Farmer') || val.includes('शेतकरी')) opt.text = getTranslation('form_category_farmer', lang);
        else if (val.includes('Career') || val.includes('नोकरी')) opt.text = getTranslation('form_category_careers', lang);
        else if (val.includes('Media') || val.includes('माध्यम')) opt.text = getTranslation('form_category_media', lang);
      });
    }

    // Input placeholders if without data-i18n-placeholder
    const nameInput = document.getElementById('name');
    if (nameInput) nameInput.placeholder = getTranslation('form_name_placeholder', lang) || nameInput.placeholder;

    const emailInput = document.getElementById('email');
    if (emailInput) emailInput.placeholder = getTranslation('form_email_placeholder', lang) || emailInput.placeholder;

    const phoneInput = document.getElementById('phone');
    if (phoneInput) phoneInput.placeholder = getTranslation('form_phone_placeholder', lang) || phoneInput.placeholder;

    const messageInput = document.getElementById('message');
    if (messageInput) messageInput.placeholder = getTranslation('form_message_placeholder', lang) || messageInput.placeholder;
  }

  // Update or inject Language Switcher in Header and Mobile Drawer
  function setupLanguageSwitchers() {
    // 1. Desktop Navbar Switcher
    const navContainer = document.querySelector('.site-header .nav-container');
    const navMenu = document.querySelector('.site-header .nav-menu');
    const mobileToggle = document.getElementById('mobileMenuToggle');

    if (navContainer && !document.getElementById('langSwitcherDesktop')) {
      const switcher = document.createElement('div');
      switcher.className = 'lang-switcher-wrap';
      switcher.id = 'langSwitcherDesktop';
      switcher.innerHTML = `
        <div class="lang-toggle-pill" role="radiogroup" aria-label="Language selection">
          <span class="lang-globe-icon" aria-hidden="true">🌐</span>
          <button type="button" class="lang-pill-btn" data-lang="en" aria-label="Switch to English" title="English">EN</button>
          <span class="lang-pill-sep">|</span>
          <button type="button" class="lang-pill-btn" data-lang="mr" aria-label="मराठी मध्ये बदला" title="मराठी">मराठी</button>
        </div>
      `;

      // Insert immediately beside contact button or before mobile hamburger
      if (mobileToggle) {
        navContainer.insertBefore(switcher, mobileToggle);
      } else {
        navContainer.appendChild(switcher);
      }
    }

    // 2. Mobile Drawer Switcher
    const mobileDrawer = document.getElementById('mobileDrawer');
    const mobileDrawerHeader = document.querySelector('.mobile-drawer-header');

    if (mobileDrawer && !document.getElementById('langSwitcherMobile')) {
      const mobileSwitcher = document.createElement('div');
      mobileSwitcher.className = 'mobile-lang-switcher-wrap';
      mobileSwitcher.id = 'langSwitcherMobile';
      mobileSwitcher.innerHTML = `
        <div class="mobile-lang-label">
          <span class="lang-globe-icon" aria-hidden="true">🌐</span>
          <span data-i18n="lang_switch_label">Language / भाषा:</span>
        </div>
        <div class="mobile-lang-toggle-pill" role="radiogroup" aria-label="Mobile language selection">
          <button type="button" class="mobile-lang-btn" data-lang="en">English</button>
          <button type="button" class="mobile-lang-btn" data-lang="mr">मराठी</button>
        </div>
      `;

      // Insert right after mobile drawer header
      if (mobileDrawerHeader) {
        mobileDrawerHeader.insertAdjacentElement('afterend', mobileSwitcher);
      } else {
        mobileDrawer.prepend(mobileSwitcher);
      }
    }

    // Attach click listeners to ALL switcher buttons (both static HTML and dynamic)
    document.querySelectorAll('.lang-pill-btn, .mobile-lang-btn').forEach(btn => {
      // Remove any existing duplicate listener by cloning or flag
      if (btn.dataset.i18nBound) return;
      btn.dataset.i18nBound = 'true';
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang) {
          setLanguage(targetLang);
        }
      });
    });

    updateSwitcherUI(getCurrentLanguage());
  }

  // Update visual state of switcher pills
  function updateSwitcherUI(lang) {
    document.querySelectorAll('.lang-pill-btn, .mobile-lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      if (btnLang === lang) {
        btn.classList.add('active');
        btn.setAttribute('aria-checked', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-checked', 'false');
      }
    });
  }

  // Update dynamic Shared Footer with active translations
  function updateSharedFooter(lang) {
    const footer = document.querySelector('.site-footer, #siteFooter');
    if (!footer) return;

    // Footer brand tagline
    const brandTagline = footer.querySelector('.logo-tagline');
    if (brandTagline) brandTagline.textContent = getTranslation('brand_sub', lang) || 'Pvt. Ltd.';

    // Footer description
    const aboutText = footer.querySelector('.footer-about-text');
    if (aboutText) aboutText.textContent = getTranslation('footer_desc', lang) || aboutText.textContent;

    // Footer headings
    const headings = footer.querySelectorAll('.footer-col h4');
    if (headings.length >= 3) {
      headings[0].textContent = getTranslation('footer_nav_heading', lang) || headings[0].textContent;
      headings[1].textContent = getTranslation('footer_contact_heading', lang) || headings[1].textContent;
      headings[2].textContent = getTranslation('footer_stay_connected', lang) || headings[2].textContent;
    }

    // Footer newsletter description & placeholder & button
    const newsletterText = footer.querySelector('.footer-col:nth-child(4) p');
    if (newsletterText) newsletterText.textContent = getTranslation('footer_newsletter_desc', lang) || newsletterText.textContent;

    const newsletterInput = footer.querySelector('.newsletter-input');
    if (newsletterInput) newsletterInput.placeholder = getTranslation('footer_newsletter_placeholder', lang) || newsletterInput.placeholder;

    const newsletterBtn = footer.querySelector('.newsletter-form button');
    if (newsletterBtn) newsletterBtn.textContent = getTranslation('footer_newsletter_btn', lang) || newsletterBtn.textContent;

    // Footer contact info
    const contactLinks = footer.querySelectorAll('.footer-col:nth-child(3) .footer-links li');
    if (contactLinks.length >= 4) {
      const addressSpan = contactLinks[0].querySelector('span');
      if (addressSpan) addressSpan.textContent = `📍 ${getTranslation('footer_address', lang) || '407, ML Tower, Ravet, Pune-412101'}`;

      const hoursSpan = contactLinks[3].querySelector('span');
      if (hoursSpan) hoursSpan.textContent = `⏰ ${getTranslation('footer_hours', lang) || 'Mon – Sat: 10:00 AM – 5:00 PM'}`;

      const adminLink = contactLinks[4]?.querySelector('a');
      if (adminLink) adminLink.textContent = `🔒 ${getTranslation('footer_admin_link', lang) || 'Admin / Inquiries Tray'}`;
    }

    // Footer navigation links
    const footerNavLinks = footer.querySelectorAll('.footer-col:nth-child(2) .footer-links a');
    footerNavLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '/') link.textContent = `› ${getTranslation('nav_home', lang)}`;
      else if (href === '/about') link.textContent = `› ${getTranslation('nav_about_us', lang)}`;
      else if (href === '/infrastructure') link.textContent = `› ${getTranslation('nav_infrastructure', lang)}`;
      else if (href === '/quality') link.textContent = `› ${getTranslation('nav_quality', lang)}`;
      else if (href === '/sustainability') link.textContent = `› ${getTranslation('nav_sustainability', lang)}`;
      else if (href === '/value-chain') link.textContent = `› ${getTranslation('nav_value_chain', lang)}`;
      else if (href === '/products') link.textContent = `› ${getTranslation('nav_products', lang)}`;
      else if (href === '/for-farmers') link.textContent = `› ${getTranslation('nav_for_farmers', lang)}`;
      else if (href === '/blog') link.textContent = `› ${getTranslation('nav_blog', lang)}`;
      else if (href === '/contact') link.textContent = `› ${getTranslation('nav_contact', lang)}`;
    });

    // Footer bottom
    const copyrightP = footer.querySelector('.footer-bottom p');
    if (copyrightP) copyrightP.textContent = getTranslation('footer_copyright', lang) || copyrightP.textContent;

    const bottomLinks = footer.querySelectorAll('.footer-bottom a');
    if (bottomLinks.length >= 2) {
      bottomLinks[0].textContent = getTranslation('footer_privacy', lang) || bottomLinks[0].textContent;
      bottomLinks[1].textContent = getTranslation('footer_terms', lang) || bottomLinks[1].textContent;
    }
  }

  // Initialize i18n
  function init() {
    setupLanguageSwitchers();
    const currentLang = getCurrentLanguage();
    setLanguage(currentLang);
  }

  // Run as early as possible
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Export public API
  window.i18n = {
    setLanguage,
    getCurrentLanguage,
    getTranslation
  };

})();
