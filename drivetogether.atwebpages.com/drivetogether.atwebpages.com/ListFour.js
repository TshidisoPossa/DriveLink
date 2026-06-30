// ─── STATE ──────────────────────────────────────────────────────
function selectYN(toggleId, val) {
  const container = document.getElementById(toggleId);
  const buttons   = container.querySelectorAll('.yn-btn');

  buttons.forEach(btn => {
    btn.classList.remove('selected-yes', 'selected-no');
    if (btn.dataset.val === val) {
      btn.classList.add(val === 'yes' ? 'selected-yes' : 'selected-no');
    }
  });

  // Show warning note if "No" is selected
  const noteMap = { ownerToggle: 'ownerNote', insuranceToggle: 'insuranceNote' };
  const noteEl  = document.getElementById(noteMap[toggleId]);
  if (noteEl) {
    noteEl.style.display = val === 'no' ? 'flex' : 'none';
  }
}

/* ─── FILE UPLOAD ─── */
function triggerUpload(inputId) {
  document.getElementById(inputId).click();
}

function showFilename(input, nameId, zoneId) {
  const nameEl = document.getElementById(nameId);
  const zoneEl = document.getElementById(zoneId);
  if (input.files && input.files[0]) {
    nameEl.textContent = '✓ ' + input.files[0].name;
    zoneEl.classList.add('uploaded');
  }
}

/* ─── DRAG & DROP ─── */
function handleDragOver(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e, inputId, zoneId, nameId) {
  e.preventDefault();
  const zone  = document.getElementById(zoneId);
  const input = document.getElementById(inputId);
  zone.classList.remove('drag-over');

  const file = e.dataTransfer.files[0];
  if (!file) return;

  // Transfer file to the hidden input (for form use)
  const dt = new DataTransfer();
  dt.items.add(file);
  input.files = dt.files;

  showFilename(input, nameId, zoneId);
}

/* ─── SUBMIT ─── */
function handleSubmit() {
  document.getElementById('successModal').classList.add('open');
}

function closeModal() {
  document.getElementById('successModal').classList.remove('open');
  window.location.href = 'index.html';
}
