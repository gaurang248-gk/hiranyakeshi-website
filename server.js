const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const session = require('express-session');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Credentials
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '998755';
const SESSION_SECRET = process.env.SESSION_SECRET || 'hiranyakeshi-agrotech-secure-session-2026';

// Data directory setup
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const INQUIRIES_FILE = path.join(DATA_DIR, 'inquiries.json');
const B2B_INQUIRIES_FILE = path.join(DATA_DIR, 'b2b-inquiries.json');
const SUBSCRIBERS_FILE = path.join(DATA_DIR, 'subscribers.json');
const BLOG_POSTS_FILE = path.join(DATA_DIR, 'blog-posts.json');

// Initialize files if they don't exist
if (!fs.existsSync(INQUIRIES_FILE)) {
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(B2B_INQUIRIES_FILE)) {
  fs.writeFileSync(B2B_INQUIRIES_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(SUBSCRIBERS_FILE)) {
  fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify([], null, 2));
}
if (!fs.existsSync(BLOG_POSTS_FILE)) {
  fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify([], null, 2));
}

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express Session Configuration (24 hours)
app.use(session({
  name: 'hiranyakeshi_sid',
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false, // Set false for local HTTP development
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Auth Middlewares
function requirePageAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.redirect('/admin-login');
}

function requireApiAuth(req, res, next) {
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  return res.status(401).json({
    success: false,
    error: 'Unauthorized. Admin login required.'
  });
}

// Intercept direct static or route access to admin/dashboard pages before express.static
const PROTECTED_PAGE_PATHS = [
  '/admin',
  '/admin.html',
  '/dashboard',
  '/dashboard.html',
  '/submission-dashboard',
  '/submission-dashboard.html',
  '/submissions-dashboard',
  '/submissions-dashboard.html',
  '/submissions',
  '/submissions.html'
];

app.use((req, res, next) => {
  const reqPath = req.path.toLowerCase().replace(/\/+$/, '') || '/';
  if (PROTECTED_PAGE_PATHS.includes(reqPath)) {
    if (!req.session || !req.session.isAuthenticated) {
      return res.redirect('/admin-login');
    }
    return res.sendFile(path.join(__dirname, 'protected', 'admin.html'));
  }
  next();
});

// Serve Public Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions for reading/writing data
function getInquiries() {
  try {
    const data = fs.readFileSync(INQUIRIES_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading inquiries:', err);
    return [];
  }
}

function saveInquiry(inquiry) {
  const inquiries = getInquiries();
  inquiries.unshift(inquiry); // Add to start
  fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
  return inquiry;
}

function getB2BInquiries() {
  try {
    const data = fs.readFileSync(B2B_INQUIRIES_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading B2B inquiries:', err);
    return [];
  }
}

function saveB2BInquiry(inquiry) {
  const inquiries = getB2BInquiries();
  inquiries.unshift(inquiry); // Add to start
  fs.writeFileSync(B2B_INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
  return inquiry;
}

function getSubscribers() {
  try {
    const data = fs.readFileSync(SUBSCRIBERS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
}

function saveSubscriber(email) {
  const subscribers = getSubscribers();
  if (!subscribers.some(s => s.email.toLowerCase() === email.toLowerCase())) {
    subscribers.push({
      email,
      subscribedAt: new Date().toISOString()
    });
    fs.writeFileSync(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2));
    return true;
  }
  return false;
}

function getBlogPosts() {
  try {
    const data = fs.readFileSync(BLOG_POSTS_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading blog posts:', err);
    return [];
  }
}

function saveBlogPost(postData) {
  const posts = getBlogPosts();
  const slug = postData.slug || postData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  const id = 'post-' + Date.now().toString(36);

  const newPost = {
    id: postData.id || id,
    slug,
    title: postData.title.trim(),
    excerpt: postData.excerpt.trim(),
    category: postData.category || 'Company News',
    date: postData.date || new Date().toISOString().split('T')[0],
    formattedDate: postData.formattedDate || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    readTime: postData.readTime || '4 min read',
    author: postData.author || 'Hiranyakeshi Editorial Desk',
    image: postData.image || '/images/hero-paddy.jpg',
    featured: !!postData.featured,
    content: postData.content || ''
  };

  posts.unshift(newPost);
  fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2));
  return newPost;
}

function updateBlogPost(id, updatedFields) {
  const posts = getBlogPosts();
  const index = posts.findIndex(p => p.id === id || p.slug === id);
  if (index === -1) return null;

  posts[index] = {
    ...posts[index],
    ...updatedFields,
    id: posts[index].id // Ensure ID remains immutable
  };

  fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2));
  return posts[index];
}

function deleteBlogPost(id) {
  let posts = getBlogPosts();
  const initialLength = posts.length;
  posts = posts.filter(p => p.id !== id && p.slug !== id);
  if (posts.length === initialLength) return false;

  fs.writeFileSync(BLOG_POSTS_FILE, JSON.stringify(posts, null, 2));
  return true;
}

// ==================== AUTHENTICATION ROUTES ====================

// GET: Admin Login Page
app.get('/admin-login', (req, res) => {
  if (req.session && req.session.isAuthenticated) {
    return res.redirect('/admin');
  }
  res.sendFile(path.join(__dirname, 'public', 'admin-login.html'));
});

// POST: Admin Login Handler
app.post('/admin-login', (req, res) => {
  const { password } = req.body;
  const isJsonRequest = req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'));

  if (password && String(password).trim() === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    if (isJsonRequest) {
      return res.json({ success: true, redirectUrl: '/admin' });
    }
    return res.redirect('/admin');
  } else {
    if (isJsonRequest) {
      return res.status(401).json({ success: false, error: 'Incorrect password' });
    }
    return res.redirect('/admin-login?error=invalid');
  }
});

// POST: API Admin Login Alias
app.post('/api/admin-login', (req, res) => {
  const { password } = req.body;
  if (password && String(password).trim() === ADMIN_PASSWORD) {
    req.session.isAuthenticated = true;
    return res.json({ success: true, redirectUrl: '/admin' });
  } else {
    return res.status(401).json({ success: false, error: 'Incorrect password' });
  }
});

// GET & POST: Admin Logout
app.get('/admin-logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('hiranyakeshi_sid');
      res.clearCookie('connect.sid');
      res.redirect('/admin-login?logout=1');
    });
  } else {
    res.redirect('/admin-login?logout=1');
  }
});

app.post('/api/admin-logout', (req, res) => {
  if (req.session) {
    req.session.destroy(() => {
      res.clearCookie('hiranyakeshi_sid');
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logged out successfully' });
    });
  } else {
    res.json({ success: true });
  }
});

// ==================== PUBLIC API ROUTES ====================

// 1. Submit Contact / Inquiry Form (Public)
app.post('/api/contact', (req, res) => {
  try {
    const { name, email, phone, category, subject, message, farmSize, paddyVariety, location } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide full name, email, phone number, and message.'
      });
    }

    const contactEmail = email ? email.trim().toLowerCase() : `contact_${Date.now()}@hiranyakeshi.in`;

    const newInquiry = {
      id: 'INQ-' + Date.now().toString(36).toUpperCase(),
      name: name.trim(),
      email: contactEmail,
      phone: phone ? phone.trim() : 'N/A',
      category: category || 'General Inquiry',
      subject: subject ? subject.trim() : 'Inquiry from Website',
      message: message.trim(),
      farmSize: farmSize ? farmSize.trim() : null,
      paddyVariety: paddyVariety ? paddyVariety.trim() : null,
      location: location ? location.trim() : null,
      status: 'New',
      createdAt: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    saveInquiry(newInquiry);

    // Notification simulation / logging
    console.log(`\n========================================`);
    console.log(`[EMAIL NOTIFICATION DISPATCHED]`);
    console.log(`To: info@hiranyakeshiagrotech.com`);
    console.log(`Subject: New ${newInquiry.category} - ${newInquiry.name} (${newInquiry.id})`);
    console.log(`From: ${newInquiry.name} <${newInquiry.email}> | Phone: ${newInquiry.phone}`);
    console.log(`Message:\n${newInquiry.message}`);
    console.log(`========================================\n`);

    return res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! Your inquiry has been submitted successfully. Our team will contact you shortly.',
      inquiryId: newInquiry.id
    });
  } catch (error) {
    console.error('Contact submit error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your request.'
    });
  }
});

// 2. Submit B2B / Bulk Order Inquiry (Public)
app.post('/api/b2b-inquiry', (req, res) => {
  try {
    const { companyName, contactPerson, email, phone, country, productInterested, quantity, message } = req.body;

    if (!companyName || !contactPerson || (!email && !phone)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide company name, contact person name, and valid contact details (email or phone).'
      });
    }

    const b2bInquiry = {
      id: 'B2B-' + Date.now().toString(36).toUpperCase(),
      companyName: companyName.trim(),
      contactPerson: contactPerson.trim(),
      email: email ? email.trim().toLowerCase() : 'N/A',
      phone: phone ? phone.trim() : 'N/A',
      country: country ? country.trim() : 'Unspecified',
      productInterested: productInterested ? productInterested.trim() : 'Paddy / Rice',
      quantity: quantity ? quantity.trim() : 'Not specified',
      message: message ? message.trim() : '',
      status: 'New',
      createdAt: new Date().toISOString(),
      formattedDate: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    saveB2BInquiry(b2bInquiry);

    // Simulated email notification
    console.log(`\n========================================`);
    console.log(`[B2B BULK INQUIRY EMAIL NOTIFICATION]`);
    console.log(`To: info@hiranyakeshiagrotech.com`);
    console.log(`Subject: New B2B Bulk Order Inquiry from ${b2bInquiry.companyName} (${b2bInquiry.id})`);
    console.log(`Company: ${b2bInquiry.companyName} | Country: ${b2bInquiry.country}`);
    console.log(`Contact: ${b2bInquiry.contactPerson} <${b2bInquiry.email}> | Phone: ${b2bInquiry.phone}`);
    console.log(`Product: ${b2bInquiry.productInterested} | Est. Quantity: ${b2bInquiry.quantity}`);
    console.log(`Message:\n${b2bInquiry.message}`);
    console.log(`========================================\n`);

    return res.status(201).json({
      success: true,
      message: 'Thank you for your bulk inquiry! Our B2B & Export trade desk will review your requirements and reach out within 24 hours.',
      inquiryId: b2bInquiry.id
    });
  } catch (error) {
    console.error('B2B submit error:', error);
    return res.status(500).json({
      success: false,
      error: 'An internal server error occurred while processing your B2B inquiry.'
    });
  }
});

// 3. Newsletter Subscription (Public)
app.post('/api/newsletter', (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address.'
      });
    }

    const isNew = saveSubscriber(email.trim().toLowerCase());
    return res.json({
      success: true,
      message: isNew
        ? 'Thank you for subscribing to Hiranyakeshi Agrotech updates!'
        : 'You are already subscribed to our newsletter updates.'
    });
  } catch (error) {
    console.error('Newsletter error:', error);
    return res.status(500).json({
      success: false,
      error: 'Unable to process subscription right now.'
    });
  }
});

// 4. Blog Posts Read API (Public)
app.get('/api/posts', (req, res) => {
  try {
    let posts = getBlogPosts();
    const { category, featured } = req.query;
    if (category && category.toLowerCase() !== 'all') {
      posts = posts.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (featured === 'true') {
      posts = posts.filter(p => p.featured);
    }
    res.json({ success: true, count: posts.length, data: posts });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blog posts' });
  }
});

app.get('/api/posts/:identifier', (req, res) => {
  try {
    const { identifier } = req.params;
    const posts = getBlogPosts();
    const post = posts.find(p => p.id === identifier || p.slug === identifier);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch article' });
  }
});

// ==================== PROTECTED ADMIN API ROUTES ====================

// 5. Get B2B Inquiries (Protected Admin)
app.get('/api/b2b-inquiries', requireApiAuth, (req, res) => {
  try {
    const inquiries = getB2BInquiries();
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch B2B inquiries' });
  }
});

// 6. Delete B2B Inquiry (Protected Admin)
app.delete('/api/b2b-inquiries/:id', requireApiAuth, (req, res) => {
  try {
    const { id } = req.params;
    let inquiries = getB2BInquiries();
    const initialLength = inquiries.length;
    inquiries = inquiries.filter(inq => inq.id !== id);

    if (inquiries.length === initialLength) {
      return res.status(404).json({ success: false, error: 'B2B inquiry not found' });
    }

    fs.writeFileSync(B2B_INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
    res.json({ success: true, message: 'B2B inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete B2B inquiry' });
  }
});

// 7. Get General Inquiries (Protected Admin)
app.get('/api/inquiries', requireApiAuth, (req, res) => {
  try {
    const inquiries = getInquiries();
    res.json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch inquiries' });
  }
});

// 8. Delete General Inquiry (Protected Admin)
app.delete('/api/inquiries/:id', requireApiAuth, (req, res) => {
  try {
    const { id } = req.params;
    let inquiries = getInquiries();
    const initialLength = inquiries.length;
    inquiries = inquiries.filter(inq => inq.id !== id);

    if (inquiries.length === initialLength) {
      return res.status(404).json({ success: false, error: 'Inquiry not found' });
    }

    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(inquiries, null, 2));
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete inquiry' });
  }
});

// 9. Get Newsletter Subscribers (Protected Admin)
app.get('/api/subscribers', requireApiAuth, (req, res) => {
  try {
    const subscribers = getSubscribers();
    res.json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch subscribers' });
  }
});

// 10. Blog Posts Mutations (Protected Admin CMS)
app.post('/api/posts', requireApiAuth, (req, res) => {
  try {
    const { title, excerpt, content, category, author, image, featured } = req.body;
    if (!title || !excerpt) {
      return res.status(400).json({ success: false, error: 'Title and excerpt are required' });
    }
    const created = saveBlogPost({ title, excerpt, content, category, author, image, featured });
    res.status(201).json({ success: true, message: 'Article published successfully', data: created });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create article' });
  }
});

app.put('/api/posts/:id', requireApiAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updated = updateBlogPost(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.json({ success: true, message: 'Article updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update article' });
  }
});

app.delete('/api/posts/:id', requireApiAuth, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteBlogPost(id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Article not found' });
    }
    res.json({ success: true, message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete article' });
  }
});

// ==================== PAGE ROUTING ====================

// Public Pages
app.get('/about', (req, res) => res.sendFile(path.join(__dirname, 'public', 'about.html')));
app.get('/infrastructure', (req, res) => res.sendFile(path.join(__dirname, 'public', 'infrastructure.html')));
app.get('/quality', (req, res) => res.sendFile(path.join(__dirname, 'public', 'quality.html')));
app.get('/sustainability', (req, res) => res.sendFile(path.join(__dirname, 'public', 'sustainability.html')));
app.get('/value-chain', (req, res) => res.sendFile(path.join(__dirname, 'public', 'value-chain.html')));
app.get('/products', (req, res) => res.sendFile(path.join(__dirname, 'public', 'products.html')));
app.get('/export-b2b', (req, res) => res.sendFile(path.join(__dirname, 'public', 'export-b2b.html')));
app.get('/for-farmers', (req, res) => res.sendFile(path.join(__dirname, 'public', 'for-farmers.html')));
app.get('/blog', (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog.html')));
app.get('/blog/:slug', (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog-post.html')));
app.get('/blog-post', (req, res) => res.sendFile(path.join(__dirname, 'public', 'blog-post.html')));
app.get('/contact', (req, res) => res.sendFile(path.join(__dirname, 'public', 'contact.html')));

// Protected Admin & Submission Dashboard Pages
app.get([
  '/admin',
  '/admin.html',
  '/dashboard',
  '/dashboard.html',
  '/submission-dashboard',
  '/submission-dashboard.html',
  '/submissions-dashboard',
  '/submissions-dashboard.html',
  '/submissions',
  '/submissions.html'
], requirePageAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'protected', 'admin.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Hiranyakeshi Agrotech Pvt. Ltd. server is running at http://localhost:${PORT}`);
});
