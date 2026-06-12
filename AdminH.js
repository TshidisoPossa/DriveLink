/* ─── PAGE TITLES ─── */
const PAGE_TITLES = {
  dashboard:     'PLATFORM DASHBOARD',
  users:         'USER MANAGEMENT',
  listings:      'LISTINGS MANAGEMENT',
  bookings:      'BOOKINGS LOG',
  disputes:      'ALL DISPUTES',
  verifications: 'VERIFICATION QUEUE',
};

/* ─── PAGE MAP: nav key → page element id ─── */
const PAGE_IDS = {
  dashboard:     'pageDashboard',
  users:         'pageUsers',
  listings:      'pageListings',
  bookings:      'pageBookings',
  disputes:      'pageDisputes',
  verifications: 'pageVerifications',
};

/* ─── NAV KEY → sidebar nav-item data-page ─── */
const NAV_MAP = {
  dashboard:     'dashboard',
  users:         'users',
  listings:      'listings',
  bookings:      'bookings',
  disputes:      'dashboard',   // disputes lives under dashboard nav item
  verifications: 'dashboard',
};

/* ══════════════════════════════
   NAVIGATION
══════════════════════════════ */
let currentPage = 'dashboard';

function navigate(event, pageKey) {
  if (event) event.preventDefault();

  // Hide all content sections
  Object.values(PAGE_IDS).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('hidden');
  });

  // Show target page
  const target = document.getElementById(PAGE_IDS[pageKey]);
  if (target) target.classList.remove('hidden');

  // Update title
  document.getElementById('pageTitle').textContent = PAGE_TITLES[pageKey] || 'DASHBOARD';

  // Update sidebar active state
  document.querySelectorAll('.nav-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.page === NAV_MAP[pageKey]) {
      item.classList.add('active');
    }
  });

  currentPage = pageKey;

  // Close notification panel
  closeNotifications();
}

/* ══════════════════════════════
   NOTIFICATION PANEL
══════════════════════════════ */
function toggleNotifications() {
  const panel = document.getElementById('notifPanel');
  panel.classList.toggle('open');
}

function closeNotifications() {
  document.getElementById('notifPanel').classList.remove('open');
}

function clearNotifications() {
  const list = document.getElementById('notifList');
  list.innerHTML = `
    <div style="padding:20px;text-align:center;color:var(--muted);font-size:0.82rem;">
      No new notifications
    </div>`;
  // Remove the red dot
  const dot = document.getElementById('notifDot');
  if (dot) dot.style.display = 'none';
  showToast('All notifications cleared');
}

/* ══════════════════════════════
   SETTINGS
══════════════════════════════ */
function openSettings() {
  showToast('Settings panel coming soon');
}

/* ══════════════════════════════
   VERIFICATION APPROVALS
══════════════════════════════ */
function approveVerif(btn) {
  btn.textContent = 'Approved ✓';
  btn.disabled = true;

  // Update the pending count on dashboard
  const countEl = document.getElementById('verifCount');
  const statEl  = document.getElementById('statVerif');

  let current = parseInt(statEl.textContent.replace(/,/g, '')) || 0;
  if (current > 0) {
    current--;
    statEl.textContent = current;
    countEl.textContent = `${current} owners awaiting ID approval.`;
  }

  showToast('Verification approved successfully');
}

/* ══════════════════════════════
   STAT COUNTER ANIMATION
══════════════════════════════ */
function animateCounter(el, target, duration = 1200) {
  const start     = 0;
  const startTime = performance.now();
  const isDecimal = String(target).includes('.');

  function update(now) {
    const elapsed  = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const value    = start + (target - start) * eased;

    el.textContent = isDecimal
      ? value.toFixed(1)
      : Math.floor(value).toLocaleString();

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function runCounters() {
  const counters = [
    { id: 'statUsers',    value: 8420  },
    { id: 'statListings', value: 642   },
    { id: 'statVerif',    value: 24    },
    { id: 'statBookings', value: 12850 },
    { id: 'statDisputes', value: 3     },
  ];

  counters.forEach(({ id, value }) => {
    const el = document.getElementById(id);
    if (el) animateCounter(el, value);
  });
}

/* ══════════════════════════════
   TOAST NOTIFICATION
══════════════════════════════ */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ══════════════════════════════
   CLOSE PANELS ON OUTSIDE CLICK
══════════════════════════════ */
document.addEventListener('click', function (e) {
  const panel   = document.getElementById('notifPanel');
  const notifBtn = document.getElementById('notifBtn');

  if (!panel.contains(e.target) && !notifBtn.contains(e.target)) {
    closeNotifications();
  }
});

/* ══════════════════════════════
   REAL-TIME CLOCK IN TOPBAR
   (optional — updates every minute)
══════════════════════════════ */
function updateClock() {
  const now  = new Date();
  const time = now.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });
  // stored but not displayed unless you add a #clock element
  document.title = `DriveLink Admin — ${time}`;
}

/* ══════════════════════════════
   INIT
══════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Animate stat counters on load
  runCounters();

  // Live clock
  updateClock();
  setInterval(updateClock, 60000);

  // Show welcome toast
  setTimeout(() => showToast('Welcome back, Admin User'), 800);
});
