document.addEventListener('DOMContentLoaded', function () {
  const raw = localStorage.getItem('paymentData');

  let data = {};

  if (raw) {
    data = JSON.parse(raw);
  } else {
    data = {
      agreement_ref: 'REF-0000',
      car_name: 'Vehicle',
      pickup_date: '',
      return_date: '',
      days: 1,
      daily_rate: 0,
      service_fee: 0,
      security_deposit: 2500,
      total: 0
    };
  }

  const ref = data.agreement_ref || 'REF-0000';
  const carName = data.car_name || 'Vehicle';
  const pickup = formatDate(data.pickup_date);
  const ret = formatDate(data.return_date);
  const days = Number(data.days) || 1;
  const dailyRate = Number(data.daily_rate) || 0;
  const serviceFee = Number(data.service_fee) || 0;
  const deposit = Number(data.security_deposit) || 2500;
  const total = Number(data.total) || 0;
  const vat = Math.round(total * 0.15);
  const totalDue = total + deposit;

  document.querySelector('.page-sub').innerHTML =
    `Complete your rental agreement for <strong>#${ref}</strong>`;

  document.querySelector('.car-name').textContent = carName;
  document.querySelector('.car-ref').textContent = 'Reference: #' + ref;

  const dateRows = document.querySelectorAll('.date-val');
  if (dateRows[0]) dateRows[0].textContent = pickup;
  if (dateRows[1]) dateRows[1].textContent = ret;
  if (dateRows[2]) dateRows[2].textContent = days + ' day' + (days !== 1 ? 's' : '');

  const priceRows = document.querySelectorAll('.price-row span:last-child');
  if (priceRows[0]) priceRows[0].textContent = formatRand(dailyRate * days);
  if (priceRows[1]) priceRows[1].textContent = 'Included';
  if (priceRows[2]) priceRows[2].textContent = formatRand(vat);

  document.querySelector('.price-row span:first-child').textContent =
    `Daily rate (${formatRand(dailyRate)} × ${days})`;

  document.querySelector('.total-amount').textContent = formatRand(totalDue);
  document.getElementById('pay-btn-text').textContent = 'Confirm and Pay ' + formatRand(totalDue);

  const payfastAmount = document.querySelector('input[name="amount"]');
  const payfastItem = document.querySelector('input[name="item_name"]');
  const payfastDesc = document.querySelector('input[name="item_description"]');
  const payfastCustom = document.querySelector('input[name="custom_str1"]');

  if (payfastAmount) payfastAmount.value = totalDue.toFixed(2);
  if (payfastItem) payfastItem.value = 'DriveLink Rental #' + ref;
  if (payfastDesc) payfastDesc.value = carName + ' Rental Agreement';
  if (payfastCustom) payfastCustom.value = ref;

  const payBtn = document.getElementById('pay-btn');

  if (payBtn) {
    payBtn.addEventListener('click', function () {
      processPayment(data, totalDue);
    });
  }
});

function processPayment(data, amount) {
  const payBtn = document.getElementById('pay-btn');
  const spinner = document.getElementById('pay-spinner');
  const btnText = document.getElementById('pay-btn-text');

  payBtn.disabled = true;
  if (spinner) spinner.classList.remove('hidden');
  if (btnText) btnText.textContent = 'Processing payment…';

  const payload = new FormData();
  payload.append('agreement_ref', data.agreement_ref || '');
  payload.append('car_name', data.car_name || '');
  payload.append('amount', amount);
  payload.append('payment_method', document.querySelector('input[name="payment_method"]:checked')?.value || 'card');

  fetch('process_payment.php', {
    method: 'POST',
    body: payload
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        document.getElementById('success-overlay').classList.remove('hidden');
        localStorage.removeItem('paymentData');
      } else {
        alert('Payment failed: ' + (result.message || 'Unknown error.'));
        payBtn.disabled = false;
        if (spinner) spinner.classList.add('hidden');
        if (btnText) btnText.textContent = 'Confirm and Pay ' + formatRand(amount);
      }
    })
    .catch(error => {
      console.error(error);
      alert('Network error. Please try again.');
      payBtn.disabled = false;
      if (spinner) spinner.classList.add('hidden');
      if (btnText) btnText.textContent = 'Confirm and Pay ' + formatRand(amount);
    });
}

function formatRand(num) {
  return 'R ' + Number(num).toLocaleString('en-ZA', {
    minimumFractionDigits: 0
  });
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

function copyText(text) {
  navigator.clipboard.writeText(text);
  alert('Copied: ' + text);
}