/* ═══════════════════════════════════════
   Booking.js
   Handles booking.html logic:
   — loads car data from URL id (CAR_DATABASE) first,
     falls back to localStorage for db-listed cars
   — renders calendar
   — calculates cost
   — on Confirm → saves to localStorage and
     navigates to Bookingtwo.html
═══════════════════════════════════════ */

// ── Global car state ──
let currentCar = null;
let calYear    = new Date().getFullYear();
let calMonth   = new Date().getMonth();

// ── Helpers ──
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function formatRand(n) {
  return 'R ' + Number(n).toLocaleString('en-ZA', { minimumFractionDigits: 0 });
}

function daysBetween(a, b) {
  if (!a || !b) return 0;
  const diff = new Date(b) - new Date(a);
  return Math.max(0, Math.floor(diff / 86400000));
}

// ── On page load ──
document.addEventListener('DOMContentLoaded', function () {

  // Hide loading overlay
  setTimeout(() => {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hide');
  }, 600);

  // Get car id from URL e.g. booking.html?id=3
  const params = new URLSearchParams(window.location.search);
  const carId  = params.get('id');

  let car = null;

  // 1) Try CAR_DATABASE first (covers all the demo cars, ids 1–12)
  if (carId && typeof CAR_DATABASE !== 'undefined' && CAR_DATABASE[carId]) {
    car = CAR_DATABASE[carId];
  }

  // 2) Fall back to localStorage (covers cars listed from your own database,
  //    which use ids like "db-7" and won't be found in CAR_DATABASE)
  if (!car) {
    const stored = localStorage.getItem('selectedCar');
    if (stored) {
      try { car = JSON.parse(stored); } catch (e) { car = null; }
    }
  }

  // 3) Last resort — placeholder so page does not break
  if (!car) {
    car = {
      id:           carId || 1,
      name:         'Vehicle',
      city:         '—',
      transmission: '—',
      type:         '—',
      price:        0,
      rating:       '—',
      reviews:      0,
      host:         { name: '—', since: '—', response: '—', time: '—', rating: '—' },
      features:     [],
      fuel:         '—',
      km:           '250km / day included',
      grad:         'grad-1'
    };
  }

  // Always keep localStorage in sync with whichever car we ended up using,
  // so the Confirm Booking step downstream has the right data too.
  localStorage.setItem('selectedCar', JSON.stringify(car));

  currentCar = car;
  populatePage(car);
  renderCalendar();

  // Set minimum date to today so past dates cannot be selected
  const today       = new Date().toISOString().split('T')[0];
  const pickupInput = document.getElementById('pickup');
  const returnInput = document.getElementById('return');
  if (pickupInput) pickupInput.min = today;
  if (returnInput) returnInput.min = today;
});

// ── Populate all page elements with car data ──
function populatePage(car) {
  setText('carName',         car.name         || '—');
  setText('carCity',         car.city         || '—');
  setText('carTransmission', car.transmission || '—');
  setText('carType',         car.type         || '—');
  setText('carPrice',        formatRand(car.price || 0));
  setText('carRating',       car.rating       || '—');
  setText('carReviews',      car.reviews ? `(${car.reviews} reviews)` : '');
  setText('extraKm',         car.km           || '250km / day included');
  setText('extraFuel',       car.fuel         || '—');

  // Host details
  const host = car.host || {};
  setText('hostName',     host.name     || '—');
  setText('hostSince',    host.since    || '—');
  setText('hostResponse', host.response || '—');
  setText('hostTime',     host.time     || '—');
  setText('hostRating',   host.rating   || '—');

  // Host avatar initial
  const initial = (host.name || 'H').charAt(0).toUpperCase();
  setText('hostInitial', initial);

  // Feature badges
  const strip = document.getElementById('carFeatures');
  if (strip && car.features && car.features.length) {
    strip.innerHTML = car.features
      .map(f => `<span class="car-badge">${f}</span>`)
      .join('');
  }

  // Hero image gradient placeholder
  const heroBox = document.getElementById('carHeroImage');
  if (heroBox) {
    const grad = car.grad || 'grad-1';
    heroBox.innerHTML = `
      <div class="hero-placeholder ${grad}">
        <svg viewBox="0 0 100 40" fill="none">
          <path d="M10 28 L18 12 Q20 8 30 8 L70 8 Q80 8 82 12 L90 28 L90 32 Q90 34 88 34 L12 34 Q10 34 10 32 Z"
            fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" stroke-width="1"/>
          <circle cx="25" cy="34" r="5"
            fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
          <circle cx="75" cy="34" r="5"
            fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
        </svg>
      </div>`;
  }
}

// ── Cost calculator — runs when dates change ──
function updateCost() {
  const pickup  = document.getElementById('pickup')?.value;
  const ret     = document.getElementById('return')?.value;
  const days    = daysBetween(pickup, ret);
  const rate    = currentCar?.price || 0;
  const sub     = rate * days;
  const fee     = Math.round(sub * 0.10);
  const total   = sub + fee;
  const summary = document.getElementById('costSummary');

  if (days > 0 && summary) {
    summary.style.display = 'block';
    summary.classList.add('pop');
    setTimeout(() => summary.classList.remove('pop'), 350);

    setText('costDaysLabel', `${days} day${days !== 1 ? 's' : ''} × ${formatRand(rate)}`);
    setText('costSubtotal',  formatRand(sub));
    setText('costFee',       formatRand(fee));
    setText('costTotal',     formatRand(total));
  } else if (summary) {
    summary.style.display = 'none';
  }
}

// ── Go to Booking Two — saves data and redirects ──
function goToBookingTwo() {
  const pickup = document.getElementById('pickup')?.value;
  const ret    = document.getElementById('return')?.value;
  const days   = daysBetween(pickup, ret);

  // Validate dates before going anywhere
  if (!pickup || !ret || days < 1) {
    alert('Please select valid pick-up and return dates before continuing.');
    return;
  }

  const rate     = currentCar?.price || 0;
  const subtotal = rate * days;
  const fee      = Math.round(subtotal * 0.10);
  const total    = subtotal + fee;

  // Build the data object bookingTwo.html will read
  const reviewData = {
    car_id:      currentCar?.id            || '',
    car_name:    currentCar?.name          || '',
    car_city:    currentCar?.city          || '',
    rating:      currentCar?.rating        || '',
    host_name:   currentCar?.host?.name    || '',
    host_since:  currentCar?.host?.since   || '',
    grad:        currentCar?.grad          || 'grad-1',
    pickup_date: pickup,
    return_date: ret,
    days:        days,
    daily_rate:  rate,
    service_fee: fee,
    total:       total
  };

  // Save to localStorage so bookingTwo.html can read it
  localStorage.setItem('bookingReview', JSON.stringify(reviewData));

  // Redirect to the review page
  window.location.href = 'Bookingtwo.html';
}

// ── Calendar renderer ──
function renderCalendar() {
  const label   = document.getElementById('calMonthLabel');
  const datesEl = document.getElementById('calDates');
  if (!label || !datesEl) return;

  const months = [
    'JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE',
    'JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'
  ];

  label.textContent = months[calMonth] + ' ' + calYear;

  const firstDay  = new Date(calYear, calMonth, 1).getDay();
  const daysInMon = new Date(calYear, calMonth + 1, 0).getDate();
  const today     = new Date();

  let html = '';

  // Empty cells before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cal-day empty"></div>';
  }

  // Day cells
  for (let d = 1; d <= daysInMon; d++) {
    const thisDate = new Date(calYear, calMonth, d);
    const isPast   = thisDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const cls      = isPast ? 'cal-day past' : 'cal-day available';
    html += `<div class="${cls}">${d}</div>`;
  }

  datesEl.innerHTML = html;
}

// Calendar navigation arrows
document.getElementById('calPrev')?.addEventListener('click', () => {
  calMonth--;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  renderCalendar();
});

document.getElementById('calNext')?.addEventListener('click', () => {
  calMonth++;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
});