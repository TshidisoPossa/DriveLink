function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function setVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

function formatRand(n) {
  return 'R ' + Number(n).toLocaleString('en-ZA', { minimumFractionDigits: 2 });
}

function formatDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  if (isNaN(d)) return str;
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

let paymentData = {};

document.addEventListener('DOMContentLoaded', function () {
  const raw = localStorage.getItem('paymentData');

  if (raw) {
    try { paymentData = JSON.parse(raw); } catch (e) { paymentData = {}; }
  }

  const ref          = paymentData.agreement_ref || paymentData.ref || 'REF-0000';
  const carName      = paymentData.car_name || 'Vehicle';
  const pickup       = paymentData.pickup_date || '';
  const ret          = paymentData.return_date || '';
  const days         = parseInt(paymentData.days) || 1;
  const rate         = parseFloat(paymentData.daily_rate) || 0;
  const fee          = parseFloat(paymentData.service_fee) || 0;
  const deposit      = parseFloat(paymentData.security_deposit) || 2500;
  const total        = parseFloat(paymentData.total) || (rate * days + fee);

  setText('refDisplay',  '#' + ref);
  setText('refDisplay2', 'Reference: #' + ref);
  setText('carNameDisplay', carName);

  setText('pickupDisplay',  formatDate(pickup));
  setText('returnDisplay',  formatDate(ret));
  setText('durationDisplay', days + (days === 1 ? ' day' : ' days'));

  setText('dailyRateLabel', `Daily rate (${formatRand(rate)} × ${days})`);
  setText('dailyRateValue', formatRand(rate * days));
  setText('serviceFeeValue', formatRand(fee));
  setText('depositValue',   formatRand(deposit));
  setText('totalDisplay',   formatRand(total));

  // Fill the hidden PayFast form fields so it's ready to submit on click
  setVal('pf-amount',     total.toFixed(2));
  setVal('pf-item-name',  'DriveLink Rental ' + ref);
  setVal('pf-item-desc',  carName + ' – Rental Payment');
  setVal('pf-custom-ref', ref);
});

function submitToPayFast() {
  const btn = document.getElementById('pay-btn');
  const btnText = document.getElementById('pay-btn-text');
  const spinner = document.getElementById('pay-spinner');

  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = 'Saving booking…';
  if (spinner) spinner.classList.remove('hidden');

  const ref     = paymentData.agreement_ref || paymentData.ref || '';
  const payload = new FormData();

  payload.append('booking_ref',      ref);
  payload.append('renter_name',      'Tshidiso');
  payload.append('car_id',           paymentData.car_id || '');
  payload.append('car_name',         paymentData.car_name || 'Vehicle');
  payload.append('host_name',        paymentData.host_name || 'Host');
  payload.append('pickup_date',      paymentData.pickup_date || '');
  payload.append('return_date',      paymentData.return_date || '');
  payload.append('days',             paymentData.days || 1);
  payload.append('daily_rate',       paymentData.daily_rate || 0);
  payload.append('service_fee',      paymentData.service_fee || 0);
  payload.append('security_deposit', paymentData.security_deposit || 0);
  payload.append('total',            paymentData.total || 0);

  fetch('save_booking.php', {
    method: 'POST',
    body: payload
  })
    .then(res => res.json())
    .then(result => {
      if (!result.success) {
        console.error('Booking save failed:', result.message);
      }

      if (btnText) btnText.textContent = 'Redirecting…';

      setTimeout(() => {
        document.getElementById('payfast-form').submit();
      }, 300);
    })
    .catch(err => {
      console.error('Network error saving booking:', err);

      setTimeout(() => {
        document.getElementById('payfast-form').submit();
      }, 300);
    });
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Copied: ' + text);
  });
}
