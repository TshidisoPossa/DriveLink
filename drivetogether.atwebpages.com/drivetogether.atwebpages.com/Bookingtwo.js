let bookingData = {};
let currentDays = 1;
let dailyRate = 0;

document.addEventListener('DOMContentLoaded', function () {
  const raw = localStorage.getItem('bookingReview');

  if (raw) {
    bookingData = JSON.parse(raw);
  } else {
    bookingData = {
      car_name: 'Vehicle',
      car_city: 'Pretoria',
      rating: '5.0',
      host_name: 'Host',
      host_since: '2025',
      pickup_date: '',
      return_date: '',
      days: 1,
      daily_rate: 0,
      service_fee: 0,
      total: 0
    };
  }

  dailyRate = parseFloat(bookingData.daily_rate) || 0;
  currentDays = parseInt(bookingData.days) || 1;

  setText('reviewCarName', bookingData.car_name || 'Vehicle');
  setText('reviewCarCity', bookingData.car_city || 'Pretoria');
  setText('reviewCarRating', bookingData.rating || '5.0');
  setText('reviewHostName', bookingData.host_name || 'Host');
  setText('reviewHostSince', bookingData.host_since || '2025');
  setText('reviewHostInitial', (bookingData.host_name || 'H').charAt(0).toUpperCase());

  setText('reviewPickup', formatDate(bookingData.pickup_date));
  setText('reviewReturn', formatDate(bookingData.return_date));

  updateCostDisplay();
});

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

function formatRand(num) {
  return 'R ' + Number(num).toLocaleString('en-ZA', {
    minimumFractionDigits: 0
  });
}

function updateCostDisplay() {
  const subtotal = dailyRate * currentDays;
  const fee = Math.round(subtotal * 0.10);
  const total = subtotal + fee;

  setText('daysValue', currentDays);
  setText('summaryDaysLabel', `Daily Rate (${formatRand(dailyRate)}) x ${currentDays}`);
  setText('summarySubtotal', formatRand(subtotal));
  setText('summaryFee', formatRand(fee));
  setText('summaryTotal', formatRand(total));

  bookingData.days = currentDays;
  bookingData.service_fee = fee;
  bookingData.total = total;
}

function changeDays(delta) {
  const newVal = currentDays + delta;

  if (newVal < 1) return;
  if (newVal > 30) return;

  currentDays = newVal;
  updateCostDisplay();
}

function submitBooking() {
  localStorage.setItem('finalBooking', JSON.stringify(bookingData));
  window.location.href = 'RentalAgreement.html';
}