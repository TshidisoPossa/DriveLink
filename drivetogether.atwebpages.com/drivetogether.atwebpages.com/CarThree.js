/* ─── STEP DATA ─── */
const STEPS = [
  { id: 1, name: 'Car Details',            state: 'done'   },
  { id: 2, name: 'Photos',                 state: 'done'   },
  { id: 3, name: 'Pricing & Availability', state: 'active' },
  { id: 4, name: 'Documentation',          state: 'locked' },
  { id: 5, name: 'Insurance',              state: 'locked' },
  { id: 6, name: 'Review & Publish',       state: 'locked' },
];

const STEP_LABELS = {
  done:   'Complete',
  active: 'In Progress',
  locked: 'Upcoming',
};

/* ─── BUILD SIDEBAR ─── */
function buildSidebar() {
  const list = document.getElementById('stepsList');

  STEPS.forEach((step, index) => {

    // Connector line between steps (not before the first)
    if (index > 0) {
      const connector = document.createElement('li');
      const prevDone  = STEPS[index - 1].state === 'done';
      connector.className = 'step-connector' + (prevDone ? ' done' : '');
      list.appendChild(connector);
    }

    
    const li       = document.createElement('li');
    li.className   = 'step-item ' + step.state;
    const iconContent = step.state === 'done' ? '' : step.id;

    li.innerHTML = `
      <div class="step-icon">${iconContent}</div>
      <div class="step-body">
        <div class="step-name">${step.name}</div>
        <div class="step-tag tag-${step.state}">${STEP_LABELS[step.state]}</div>
      </div>
    `;

    list.appendChild(li);
  });

  updateProgress();
}

/* ─── UPDATE PROGRESS BAR ─── */
function updateProgress() {
  const doneCount   = STEPS.filter(s => s.state === 'done').length;
  const activeCount = STEPS.filter(s => s.state === 'active').length;
  const percentage  = Math.round(((doneCount + activeCount * 0.5) / STEPS.length) * 100);

  // Slight delay so the CSS transition plays visibly on load
  setTimeout(() => {
    document.getElementById('progressFill').style.width = percentage + '%';
    document.getElementById('progressPct').textContent  = percentage + '%';
  }, 300);
}

/* ─── BOOKING TYPE TOGGLE ─── */
function setBooking(type) {
  document.getElementById('btnInstant').classList.toggle('active', type === 'instant');
  document.getElementById('btnRequest').classList.toggle('active', type === 'request');
}

/* ───  NOTIFICATION ─── */
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

/* ─── LIVE WEEKLY RATE SUGGESTION ─── */
function handleDailyRateInput() {
  const dailyValue  = parseFloat(this.value);
  const weeklyInput = document.getElementById('weeklyRate');

  if (dailyValue >= 100 && !weeklyInput.value) {
    weeklyInput.placeholder = (dailyValue * 7 * 0.85).toFixed(2);
  }
}

/* ─── BACK BUTTON ─── */
function goBack() {
  showToast('Navigating to Photos…');
}

/* ─── SAVE & CONTINUE ─── */
function saveContinue() {
  const dailyInput = document.getElementById('dailyRate');
  const dailyValue = parseFloat(dailyInput.value) || 0;
  const inputWrap  = dailyInput.closest('.input-wrap');

  if (dailyValue < 100) {
    inputWrap.style.borderColor = '#ef4444';
    inputWrap.style.boxShadow   = '0 0 0 3px rgba(239, 68, 68, 0.12)';
    showToast('⚠️  Daily rate must be at least R 100');
    return;
  }

  // Clear any error state
  inputWrap.style.borderColor = '';
  inputWrap.style.boxShadow   = '';
  showToast('✓ Saved! Proceeding to Documentation…');
}

/* ─── EVENT LISTENERS ─── */
document.addEventListener('DOMContentLoaded', () => {
  buildSidebar();

  document.getElementById('btnInstant').addEventListener('click', () => setBooking('instant'));
  document.getElementById('btnRequest').addEventListener('click', () => setBooking('request'));
  document.getElementById('btnBack').addEventListener('click', goBack);
  document.getElementById('btnSave').addEventListener('click', saveContinue);
  document.getElementById('dailyRate').addEventListener('input', handleDailyRateInput);
});
