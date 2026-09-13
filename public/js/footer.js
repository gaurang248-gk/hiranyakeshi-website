/**
 * HIRANYAKESHI AGROTECH PVT. LTD.
 * Shared Footer Component
 * 
 * Single source of truth for the site-wide footer.
 * Renders identically across all pages:
 * Col 1: Company Logo, Tagline & Social Links (LinkedIn, Facebook, Instagram)
 * Col 2: Navigation Links (All 10 pages)
 * Col 3: Contact Info (Address, Phone, Email, Hours, Admin Tray)
 * Col 4: Stay Connected (Newsletter form)
 * Bottom Bar: Copyright & Policy Links
 */

const SHARED_FOOTER_HTML = `
  <div class="container">
    <div class="footer-grid" style="grid-template-columns: 1.3fr 0.8fr 0.8fr 1.1fr 1.1fr;">
      <!-- Col 1: Company Info -->
      <div class="footer-col">
        <a href="/" class="brand-logo" style="margin-bottom:14px; display:inline-flex;">
          <div class="logo-icon-box" style="width:44px; height:44px; min-width:44px; min-height:44px; flex-shrink:0;">🌾</div>
          <div class="logo-text-group">
            <span class="logo-title">Hiranyakeshi Agrotech</span>
            <span class="logo-tagline">Farmer First. Women Led. Naturally Better.</span>
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

      <!-- Col 2: Navigation Part 1 -->
      <div class="footer-col">
        <h4>Navigation</h4>
        <ul class="footer-links">
          <li><a href="/">› Home</a></li>
          <li><a href="/about">› About Us</a></li>
          <li><a href="/infrastructure">› Infrastructure</a></li>
          <li><a href="/quality">› Quality &amp; Certifications</a></li>
          <li><a href="/sustainability">› Sustainability &amp; CSR</a></li>
        </ul>
      </div>

      <!-- Col 3: Navigation Part 2 -->
      <div class="footer-col">
        <h4 style="opacity:0; user-select:none;">.</h4>
        <ul class="footer-links">
          <li><a href="/value-chain">› Value Chain</a></li>
          <li><a href="/products">› Products</a></li>
          <li><a href="/for-farmers">› For Farmers</a></li>
          <li><a href="/blog">› News &amp; Updates</a></li>
          <li><a href="/contact">› Contact Us</a></li>
        </ul>
      </div>

      <!-- Col 4: Contact Info -->
      <div class="footer-col">
        <h4>Contact Info</h4>
        <ul class="footer-links">
          <li style="display:flex; align-items:flex-start; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive-clay)" stroke-width="2" style="flex-shrink:0; margin-top:3px;">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>407, ML Tower, Ravet, Pune-412101</span>
          </li>
          <li style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive-clay)" stroke-width="2" style="flex-shrink:0;">
              <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"></path>
            </svg>
            <a href="tel:+918087841214">+91 8087841214</a>
          </li>
          <li style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive-clay)" stroke-width="2" style="flex-shrink:0;">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
              <polyline points="22,6 12,13 2,6"></polyline>
            </svg>
            <a href="mailto:info@hiranyakeshiagrotech.com">info@hiranyakeshiagrotech.com</a>
          </li>
          <li style="display:flex; align-items:center; gap:8px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive-clay)" stroke-width="2" style="flex-shrink:0;">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Mon – Sat: 10:00 AM – 5:00 PM</span>
          </li>
          <li style="display:flex; align-items:center; gap:8px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(178,166,103,0.3);">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--color-olive-clay)" stroke-width="2" style="flex-shrink:0;">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0110 0v4"></path>
            </svg>
            <a href="/admin" style="color:var(--color-olive-clay);">Admin / Inquiries Tray</a>
          </li>
        </ul>
      </div>

      <!-- Col 5: Stay Connected -->
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

function renderSharedFooter() {
  const footerContainers = document.querySelectorAll('.site-footer, #siteFooter');
  if (footerContainers.length > 0) {
    footerContainers.forEach(container => {
      container.className = 'site-footer';
      container.id = 'siteFooter';
      container.innerHTML = SHARED_FOOTER_HTML;
    });

    // Re-bind newsletter if app.js is loaded
    if (typeof initNewsletter === 'function') {
      initNewsletter();
    }
  }
}

// Auto-run when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderSharedFooter);
} else {
  renderSharedFooter();
}
