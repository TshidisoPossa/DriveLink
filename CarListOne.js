/* ── Populate year dropdown ── */ 
const yearSelect = document.getElementById('year');
const currentYear = new Date().getFullYear();

yearSelect.innerHTML = '<option value="">Select Year</option>';

for (let y = currentYear; y >= 1985; y--) {
  const opt = document.createElement('option');
  opt.value = y;
  opt.textContent = y;
  yearSelect.appendChild(opt);
}

document.getElementById('avail_from').value = new Date().toISOString().split('T')[0];

let currentStep = 1;
const TOTAL = 6;

function goToStep(step) {
  document.getElementById('panel-' + currentStep).classList.remove('active');

  document.querySelectorAll('.step-item').forEach(el => {
    el.classList.remove('active');
    const s = parseInt(el.dataset.step);
    if (s < step) el.classList.add('done');
  });

  if (step > currentStep) {
    const prevBubble = document.getElementById('bubble-' + currentStep);
    if (prevBubble) prevBubble.innerHTML = '&#10003;';
  }

  currentStep = step;

  const nextPanel = document.getElementById('panel-' + step);
  if (nextPanel) nextPanel.classList.add('active');

  const activeItem = document.querySelector('.step-item[data-step="' + step + '"]');
  if (activeItem) activeItem.classList.add('active');

  document.getElementById('progressFill').style.width =
    ((step / TOTAL) * 100) + '%';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function nextStep(from) {
  if (from < TOTAL) goToStep(from + 1);
}

function prevStep(from) {
  if (from > 1) goToStep(from - 1);
}

/* ── Submit listing to database ── */
function submitListing() {
  const agree = document.getElementById('agree');

  if (!agree.checked) {
    alert('Please confirm the declaration before submitting.');
    return;
  }

  const selectedFeatures = Array.from(
    document.querySelectorAll('input[name="features"]:checked')
  ).map(cb => cb.value).join(', ');

  const formData = new FormData();

  formData.append('make', document.getElementById('make').value);
  formData.append('model', document.getElementById('model').value);
  formData.append('year', document.getElementById('year').value);
  formData.append('colour', document.getElementById('colour').value);
  formData.append('registration', document.getElementById('plate').value);
  formData.append('vin_number', document.getElementById('vin').value);
  formData.append('kilometers', document.getElementById('odometer').value);
  formData.append('vehicle_category', document.getElementById('category').value);

  formData.append(
    'transmission',
    document.querySelector('input[name="transmission"]:checked')?.value || ''
  );

  formData.append(
    'gearbox',
    document.querySelector('input[name="transmission"]:checked')?.value || ''
  );

  formData.append(
    'fuel_type',
    document.querySelector('input[name="fuel_type"]:checked')?.value || ''
  );

  formData.append('daily_rate', document.getElementById('daily_rate').value);
  formData.append('weekly_rate', document.getElementById('weekly_rate').value || 0);
  formData.append('minimum_rental_period', document.getElementById('min_period').value);
  formData.append('booking_type', 'Request book');
  formData.append('vehicle_features', selectedFeatures);
  formData.append('daily_kilometer_rate', document.getElementById('max_km').value || 0);
  formData.append('extra_kilometer_rate', 0);

  formData.append(
    'minimum_driver_age',
    document.getElementById('min_age').value.replace(' years', '')
  );

  fetch('save_vehicle.php', {
    method: 'POST',
    body: formData
  })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'success') {
        alert('Listing submitted successfully!');
        window.location.href = 'RenterDashboard.html';
      } else {
        alert(data);
      }
    })
    .catch(error => {
      alert('Something went wrong while saving the listing.');
      console.log(error);
    });
}

/* ── Feature checkbox toggle ── */
function toggleFeature(label) {
  const checkbox = label.querySelector('input[type="checkbox"]');

  setTimeout(() => {
    label.classList.toggle('checked', checkbox.checked);
  }, 0);
}

/* ── Photo upload preview ── */
function handlePhotos(event) {
  const files = Array.from(event.target.files);
  const grid  = document.getElementById('photoGrid');

  files.forEach(file => {
    const reader = new FileReader();

    reader.onload = e => {
      const thumb = document.createElement('div');
      thumb.className = 'photo-thumb';

      thumb.innerHTML =
        '<img src="' + e.target.result + '" alt="Car photo" />' +
        '<button class="photo-remove" onclick="this.parentElement.remove()"' +
        ' title="Remove photo">&times;</button>';

      grid.appendChild(thumb);
    };

    reader.readAsDataURL(file);
  });

  event.target.value = '';
}