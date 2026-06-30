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
    month: 'long',
    year: 'numeric'
  });
}

function formatRand(n) {
  return 'R ' + Number(n).toLocaleString('en-ZA', {
    minimumFractionDigits: 0
  });
}

function generateRef() {
  return 'REF-' + Math.floor(1000 + Math.random() * 9000);
}

function generateInvoice() {
  return 'INVOICE #' + Math.floor(1000 + Math.random() * 9000);
}

document.addEventListener('DOMContentLoaded', function () {
  const raw = localStorage.getItem('bookingReview');

  let data = {};

  if (raw) {
    data = JSON.parse(raw);
  } else {
    data = {
      car_id: '',
      car_name: 'Vehicle',
      car_city: 'Agreed location',
      host_name: 'Owner',
      pickup_date: '',
      return_date: '',
      days: 1,
      daily_rate: 0,
      service_fee: 0,
      total: 0
    };
  }

  const ref = generateRef();
  const invoice = generateInvoice();
  const agreementRef =
    'DL-' +
    new Date().getFullYear() +
    '-' +
    String(Math.floor(10000 + Math.random() * 90000));

  setText('refNumber', '#' + ref);
  setText('agreementRef', agreementRef);
  setText('invoiceNum', invoice);

  const today = new Date();

  setText(
    'effectiveDate',
    today.toLocaleDateString('en-ZA', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).toUpperCase()
  );

  const hostName = data.host_name || 'Owner';

  setText('ownerName', hostName.toUpperCase());
  setText('ownerInitial', hostName.charAt(0).toUpperCase());
  setText('ownerSigName', hostName.toUpperCase());

  const timestamp =
    today.toLocaleDateString('en-ZA', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }) +
    ' · ' +
    today.toLocaleTimeString('en-ZA', {
      hour: '2-digit',
      minute: '2-digit'
    }) +
    ' GMT+2';

  setText('ownerTimestamp', 'Timestamp: ' + timestamp + ' · IP: 197.***.**.12');

  const carName = data.car_name || 'Vehicle';

  setText('vehicleName', carName.toUpperCase());

  const grads = ['grad-1', 'grad-2', 'grad-3', 'grad-4'];
  const g = grads[(parseInt(data.car_id) || 0) % grads.length];
  const imgBox = document.getElementById('vehicleImgBox');

  if (imgBox) {
    imgBox.className = 'vehicle-img-placeholder ' + g;
  }

  const pickup = data.pickup_date;
  const ret = data.return_date;
  const days = parseInt(data.days) || 1;
  const rate = parseFloat(data.daily_rate) || 0;
  const fee = parseFloat(data.service_fee) || 0;
  const total = parseFloat(data.total) || 0;

  setText('pickupDateTime', formatDate(pickup) + ' · 10:00 AM');
  setText('returnDateTime', formatDate(ret) + ' · 10:00 AM');
  setText('pickupLocation', data.car_city || 'Agreed location');

  setText(
    'rentalDaysLabel',
    `${days} Day${days !== 1 ? 's' : ''} Rental (@ ${formatRand(rate)})`
  );

  setText('rentalSubtotal', formatRand(rate * days));
  setText('rentalFee', formatRand(fee));
  setText('securityDeposit', formatRand(2500));
  setText('totalAmount', formatRand(total));

  window._agreementData = {
    booking_ref: agreementRef,
    car_name: carName,
    host_name: hostName,
    pickup_date: pickup,
    return_date: ret,
    days: days,
    daily_rate: rate,
    service_fee: fee,
    total: total,
    car_id: data.car_id || '',
    invoice: invoice,
    ref: ref,
    security_deposit: 2500
  };
});

function handleCheckbox() {
  const checkbox = document.getElementById('agreeCheckbox');
  const finalizeBtn = document.getElementById('finalizeBtn');
  const pending = document.getElementById('sigPending');

  if (checkbox.checked) {
    finalizeBtn.disabled = false;

    if (pending) {
      pending.classList.add('signed');
      pending.innerHTML =
        '<i class="fa-solid fa-circle-check"></i><p>Agreement accepted</p>';
    }
  } else {
    finalizeBtn.disabled = true;

    if (pending) {
      pending.classList.remove('signed');
      pending.innerHTML =
        '<i class="fa-solid fa-pen-to-square"></i><p>Click to sign digitally</p>';
    }
  }
}

function finalizeAgreement() {
  const checkbox = document.getElementById('agreeCheckbox');

  if (!checkbox.checked) {
    alert('Please tick the checkbox to confirm you agree to the terms.');
    return;
  }

  const btn = document.getElementById('finalizeBtn');

  btn.disabled = true;
  btn.textContent = 'Signing…';

  const data = window._agreementData || {};
  const payload = new FormData();

  Object.keys(data).forEach(key => {
    payload.append(key, data[key]);
  });

  fetch('RentalAgreement.php', {
    method: 'POST',
    body: payload
  })
    .then(res => res.json())
    .then(result => {
      if (result.success) {
        const badge = document.getElementById('statusBadge');

        if (badge) {
          badge.textContent = 'Signed by Renter';
          badge.style.color = '#16a34a';
        }

        const sigCard = document.getElementById('renterSigCard');

        if (sigCard) {
          sigCard.style.border = '2px solid #16a34a';
          sigCard.style.background = '#f0fdf4';
        }

        const dlBtn = document.getElementById('downloadBtn');

        if (dlBtn) {
          dlBtn.disabled = false;
          dlBtn.classList.add('active');
          dlBtn.onclick = () => window.print();
        }

        btn.innerHTML =
          '<i class="fa-solid fa-circle-check"></i> Agreement Signed';

        btn.style.background = '#16a34a';

        const paymentData = {
          agreement_ref: result.agreement_ref || data.booking_ref || '',
          invoice: data.invoice || '',
          ref: data.ref || '',
          car_id: data.car_id || '',
          car_name: data.car_name || 'Vehicle',
          host_name: data.host_name || 'Host',
          pickup_date: data.pickup_date || '',
          return_date: data.return_date || '',
          days: data.days || 1,
          daily_rate: data.daily_rate || 0,
          service_fee: data.service_fee || 0,
          security_deposit: 2500,
          total: data.total || 0
        };

        localStorage.setItem('paymentData', JSON.stringify(paymentData));

        setTimeout(() => {
          window.location.href = 'Payment.html';
        }, 700);
      } else {
        alert('Error: ' + (result.message || 'Something went wrong.'));

        btn.disabled = false;
        btn.innerHTML =
          '<i class="fa-solid fa-file-signature"></i> Finalize & Sign Agreement';
      }
    })
    .catch(err => {
      console.error(err);

      alert('Network error. Please try again.');

      btn.disabled = false;
      btn.innerHTML =
        '<i class="fa-solid fa-file-signature"></i> Finalize & Sign Agreement';
    });
}