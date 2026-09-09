/**
 * HIRANYAKESHI AGROTECH PVT. LTD.
 * Interactive Frontend JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  initSharedFooter();
  initNavigation();
  initForms();
  initNewsletter();
  initStatsAnimation();
});

/* Navigation & Mobile Drawer */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.getElementById('mobileMenuToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileBackdrop = document.getElementById('mobileBackdrop');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // Mobile drawer open/close
  function openDrawer() {
    mobileDrawer?.classList.add('open');
    mobileBackdrop?.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('open');
    mobileBackdrop?.classList.remove('open');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openDrawer);
  closeDrawerBtn?.addEventListener('click', closeDrawer);
  mobileBackdrop?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Mobile dropdown toggles (accordion)
  const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = toggle.closest('.has-mobile-dropdown');
      const submenu = parentItem?.querySelector('.mobile-submenu');
      const isOpen = toggle.classList.contains('open');

      if (isOpen) {
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        submenu?.classList.remove('open');
      } else {
        toggle.classList.add('open');
        toggle.setAttribute('aria-expanded', 'true');
        submenu?.classList.add('open');
      }
    });
  });

  // Set active nav link according to current URL
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link, .dropdown-item, .mobile-submenu-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || (currentPath === '/' && href === 'index.html') || (href !== '/' && currentPath.endsWith(href)))) {
      link.classList.add('active');

      // If this is a dropdown item, also highlight parent dropdown button
      const parentDropdown = link.closest('.has-dropdown');
      if (parentDropdown) {
        const toggleBtn = parentDropdown.querySelector('.dropdown-toggle');
        toggleBtn?.classList.add('active');
      }

      // If mobile submenu, auto expand parent and highlight toggle
      const mobileParentDropdown = link.closest('.has-mobile-dropdown');
      if (mobileParentDropdown) {
        const mobileToggle = mobileParentDropdown.querySelector('.mobile-dropdown-toggle');
        const mobileSubmenu = mobileParentDropdown.querySelector('.mobile-submenu');
        mobileToggle?.classList.add('open', 'active');
        mobileToggle?.setAttribute('aria-expanded', 'true');
        mobileSubmenu?.classList.add('open');
      }
    }
  });
}

/* Contact & Inquiry Form Submission */
function initForms() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Form inputs
    let emailVal = contactForm.querySelector('#email')?.value?.trim();
    const phoneVal = contactForm.querySelector('#phone')?.value?.trim();
    const paddyVarietyVal = contactForm.querySelector('#paddyVariety')?.value?.trim();

    // If email is empty but phone is provided (common for farmer registrations), generate a partner placeholder
    if (!emailVal && phoneVal) {
      emailVal = `farmer_${phoneVal.replace(/\D/g, '')}@partner.hiranyakeshi.in`;
    }

    const formData = {
      name: contactForm.querySelector('#name')?.value?.trim(),
      email: emailVal,
      phone: phoneVal || 'N/A',
      category: contactForm.querySelector('#category')?.value || 'General Inquiry',
      subject: contactForm.querySelector('#subject')?.value?.trim(),
      message: contactForm.querySelector('#message')?.value?.trim(),
      farmSize: contactForm.querySelector('#farmSize')?.value?.trim() || null,
      paddyVariety: paddyVarietyVal || null,
      location: contactForm.querySelector('#location')?.value?.trim() || null
    };

    if (!formData.name || !formData.message || (!formData.email && !formData.phone)) {
      showToast('Please fill in your Name, Contact Number/Email, and Message.', 'error');
      return;
    }

    // Set loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
      <svg style="animation: spin 1s linear infinite; width:18px; height:18px; margin-right:8px; display:inline-block;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"></circle>
      </svg>
      Submitting Inquiry...
    `;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(result.message || 'Inquiry submitted successfully! We will connect with you soon.', 'success');
        contactForm.reset();
      } else {
        showToast(result.error || 'Failed to submit inquiry. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Submission error:', error);
      showToast('Network error while submitting. Please try again.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/* Newsletter Subscription */
function initNewsletter() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const submitBtn = form.querySelector('button');
      const email = input?.value?.trim();

      if (!email) {
        showToast('Please enter an email address.', 'error');
        return;
      }

      if (submitBtn) submitBtn.disabled = true;

      try {
        const response = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const result = await response.json();

        if (response.ok && result.success) {
          showToast(result.message, 'success');
          input.value = '';
        } else {
          showToast(result.error || 'Failed to subscribe.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please try again later.', 'error');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
}

/* Toast Notifications */
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icon = type === 'success'
    ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
    : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

  toast.innerHTML = `
    <div style="flex-shrink:0;">${icon}</div>
    <div style="font-size:0.92rem; line-height:1.4;">${message}</div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

/* Subtle Counter Animation for Stats */
function initStatsAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.2 });

  statNumbers.forEach(stat => observer.observe(stat));
}

// Inline Spinner CSS helper
const styleTag = document.createElement('style');
styleTag.innerHTML = `
  @keyframes spin { 100% { transform: rotate(360deg); } }
`;
document.head.appendChild(styleTag);

/* Shared Footer Component */
const SHARED_FOOTER_HTML = `
  <div class="container">
    <div class="footer-grid">
      <!-- Col 1: Company Info -->
      <div class="footer-col">
        <a href="/" class="brand-logo" style="margin-bottom:14px; display:inline-flex;">
          <div class="logo-icon-box">🌾</div>
          <div class="logo-text-group">
            <span class="logo-title">Hiranyakeshi Agrotech</span>
            <span class="logo-tagline">Pvt. Ltd.</span>
          </div>
        </a>
        <p class="footer-about-text">
          Integrated farm-to-consumer value chain for paddy and rice.
        </p>
        <div class="social-links-row">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"></path>
              <rect x="2" y="9" width="4" height="12"></rect>
              <circle cx="4" cy="4" r="2"></circle>
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="Facebook">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      </div>

      <!-- Col 2: Navigation Links -->
      <div class="footer-col">
        <h4>Navigation</h4>
        <ul class="footer-links">
          <li><a href="/">› Home</a></li>
          <li><a href="/about">› About Us</a></li>
          <li><a href="/infrastructure">› Infrastructure</a></li>
          <li><a href="/quality">› Quality &amp; Certifications</a></li>
          <li><a href="/sustainability">› Sustainability &amp; CSR</a></li>
          <li><a href="/value-chain">› Value Chain</a></li>
          <li><a href="/products">› Products</a></li>
          <li><a href="/for-farmers">› For Farmers</a></li>
          <li><a href="/blog">› News &amp; Updates</a></li>
          <li><a href="/contact">› Contact Us</a></li>
        </ul>
      </div>

      <!-- Col 3: Contact Info -->
      <div class="footer-col">
        <h4>Contact Info</h4>
        <ul class="footer-links">
          <li><span>📍 Registered Office, Agro Hub</span></li>
          <li><a href="tel:+919876543210">📞 +91 98765 43210</a></li>
          <li><a href="mailto:hiranyakeshi.agrotech@gmail.com">✉️ hiranyakeshi.agrotech@gmail.com</a></li>
          <li><span>⏰ Mon – Sat: 10:00 AM – 5:00 PM</span></li>
          <li><a href="/admin" style="color:var(--color-olive-clay); margin-top:8px;">🔒 Admin / Inquiries Tray</a>
          </li>
        </ul>
      </div>

      <!-- Col 4: Stay Connected -->
      <div class="footer-col">
        <h4>Stay Connected</h4>
        <p style="font-size:0.92rem; color:rgba(241,227,194,0.8); margin-bottom:12px;">
          Subscribe for seasonal paddy harvest updates, market trends, and agri insights.
        </p>
        <form class="newsletter-form">
          <input type="email" class="newsletter-input" placeholder="Enter your email" required aria-label="Newsletter email address">
          <button type="submit" class="btn btn-accent btn-sm">Join</button>
        </form>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <p style="color: var(--color-sandstone);">© 2026 Hiranyakeshi Agrotech Pvt. Ltd. All Rights Reserved.</p>
      <div style="display:flex; gap:16px; flex-wrap:wrap;">
        <a href="/contact">Privacy Policy</a>
        <a href="/contact">Terms of Service</a>
      </div>
    </div>
  </div>
`;

function initSharedFooter() {
  const footerContainers = document.querySelectorAll('.site-footer, #siteFooter');
  if (footerContainers.length > 0) {
    footerContainers.forEach(container => {
      container.className = 'site-footer';
      container.id = 'siteFooter';
      container.innerHTML = SHARED_FOOTER_HTML;
    });
  }
}

