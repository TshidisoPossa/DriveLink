/* ═══════════════════════════════════════════
   RenterDashboard.js
   Handles filtering, dropdown, and booking navigation
═══════════════════════════════════════════ */

/* DEMO CARS BOOKING */
function bookCar(carId) {
  const car = (typeof CAR_DATABASE !== 'undefined') ? CAR_DATABASE[carId] : null;

  if (car) {
    localStorage.setItem('selectedCar', JSON.stringify(car));
  } else {
    localStorage.setItem('selectedCar', JSON.stringify({ id: carId }));
  }

  window.location.href = 'booking.html?id=' + carId;
}

/* DATABASE CARS BOOKING */
function bookListedCar(index) {
  const vehicle = window.LISTED_CARS[index];

  if (!vehicle) {
    alert('Car information could not be found.');
    return;
  }

  const listedCar = {
    id: 'db-' + vehicle.id,
    name: `${vehicle.make} ${vehicle.model} ${vehicle.year}`,
    city: vehicle.city || 'Pretoria',
    transmission: vehicle.transmission || vehicle.gearbox || '—',
    type: vehicle.vehicle_category || '—',
    price: Number(vehicle.daily_rate) || 0,
    rating: 'New',
    reviews: 0,
    host: {
      name: 'DriveLink Host',
      since: 'Host since 2026',
      response: '100%',
      time: '1 hour',
      rating: 'New'
    },
    features: [
      vehicle.fuel_type || '',
      vehicle.vehicle_category || '',
      vehicle.kilometers ? vehicle.kilometers + ' km' : ''
    ].filter(Boolean),
    fuel: vehicle.fuel_type || '—',
    km: vehicle.daily_kilometer_rate
      ? vehicle.daily_kilometer_rate + 'km / day included'
      : '250km / day included',
    grad: 'grad-1'
  };

  localStorage.setItem('selectedCar', JSON.stringify(listedCar));

  window.location.href = 'booking.html?id=db-' + vehicle.id;
}

/* FILTER CARS */
function filterCars() {
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const type = document.getElementById('typeFilter')?.value || '';
  const price = document.getElementById('priceFilter')?.value || '';
  const location = document.getElementById('locationFilter')?.value || '';

  const cards = document.querySelectorAll('.car-card');
  let visible = 0;

  cards.forEach(card => {
    const cardType = card.dataset.type || '';
    const cardPrice = parseInt(card.dataset.price) || 0;
    const cardLocation = card.dataset.location || '';
    const cardText = card.innerText.toLowerCase();

    const matchSearch = !search || cardText.includes(search);
    const matchType = !type || cardType === type;
    const matchLocation = !location || cardLocation === location;

    const matchPrice =
      !price ||
      (price === 'low' && cardPrice < 600) ||
      (price === 'mid' && cardPrice >= 600 && cardPrice <= 1000) ||
      (price === 'high' && cardPrice > 1000);

    const show = matchSearch && matchType && matchLocation && matchPrice;

    card.style.display = show ? '' : 'none';

    if (show) visible++;
  });

  const countEl = document.getElementById('resultsCount');
  if (countEl) {
    countEl.textContent = `${visible} car${visible !== 1 ? 's' : ''} available`;
  }

  const noResults = document.getElementById('noResults');
  if (noResults) {
    noResults.style.display = visible === 0 ? 'block' : 'none';
  }
}

function resetFilters() {
  ['searchInput', 'typeFilter', 'priceFilter', 'locationFilter'].forEach(id => {
    const el = document.getElementById(id);

    if (el) {
      el.value = '';
    }
  });

  filterCars();
}

/* PROFILE DROPDOWN */
function toggleDropdown() {
  const dropdown = document.getElementById('dropdown');
  const chevron = document.getElementById('chevron');

  if (!dropdown) return;

  const open = dropdown.classList.toggle('open');

  if (chevron) {
    chevron.classList.toggle('open', open);
  }
}

document.addEventListener('click', function (e) {
  const profile = document.querySelector('.nav-profile');
  const dropdown = document.getElementById('dropdown');
  const chevron = document.getElementById('chevron');

  if (!profile || !dropdown) return;

  if (!profile.contains(e.target)) {
    dropdown.classList.remove('open');

    if (chevron) {
      chevron.classList.remove('open');
    }
  }
});