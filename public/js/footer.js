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
          <li><a href="/admin" style="color:var(--color-olive-clay); margin-top:8px;">🔒 Admin / Inquiries Tray</a></li>
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
