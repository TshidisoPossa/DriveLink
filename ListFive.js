const state = {
  smoking: 'no',
  pets: 'no',
  additionalDrivers: true
};

// ─── YES / NO RULE TOGGLE ────────────────────────────────────────
/**
 * Sets the active Yes/No button in a rule group.
 * @param {string} groupId - ID of the .yn-group container
 * @param {string} val     - 'yes' or 'no'
 */
function setRule(groupId, val) {
  const group = document.getElementById(groupId);
  if (!group) return;

  group.querySelectorAll('.yn-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.val === val);
  });

  if (groupId === 'smokingGroup') state.smoking = val;
  if (groupId === 'petsGroup') state.pets = val;
}

// ─── SAVE & CONTINUE ────────────────────────────────────────────
/**
 * Collects all form values, validates required fields,
 * and saves to sessionStorage before navigating.
 */
function handleContinue() {
  const kmLimit   = document.getElementById('kmLimit').value.trim();
  const extraKm   = document.getElementById('extraKm').value.trim();
  const minAge    = document.getElementById('minAge').value;
  const lateFee   = document.getElementById('lateFee').value.trim();
  const addDrivers = document.getElementById('additionalDrivers').checked;

  // Collect selected features
  const features = Array.from(
    document.querySelectorAll('input[name="features"]:checked')
  ).map(cb => cb.value);

  // Basic validation — km limit must be a non-negative number if provided
  if (kmLimit !== '' && (isNaN(Number(kmLimit)) || Number(kmLimit) < 0)) {
    alert('Please enter a valid daily kilometre limit (0 for unlimited).');
    document.getElementById('kmLimit').focus();
    return;
  }

  if (extraKm !== '' && (isNaN(Number(extraKm)) || Number(extraKm) < 0)) {
    alert('Please enter a valid extra km rate.');
    document.getElementById('extraKm').focus();
    return;
  }

  if (lateFee !== '' && (isNaN(Number(lateFee)) || Number(lateFee) < 0)) {
    alert('Please enter a valid late return fee.');
    document.getElementById('lateFee').focus();
    return;
  }

  // Save to sessionStorage
  const formData = {
    features,
    rules: {
      smoking: state.smoking,
      pets: state.pets,
      kmLimit: kmLimit === '' ? 0 : Number(kmLimit),
      extraKmRate: extraKm === '' ? 0 : Number(extraKm),
      minDriverAge: Number(minAge),
      lateReturnFee: lateFee === '' ? 0 : Number(lateFee),
      additionalDrivers: addDrivers
    },
    savedAt: new Date().toISOString()
  };

  try {
    sessionStorage.setItem('drivelink_features_rules', JSON.stringify(formData));
  } catch {
    // sessionStorage unavailable — continue anyway
  }

  // Navigate to next step (Documents & Submit)
  alert('Saved! Proceeding to Documents & Submit.');
  // window.location.href = 'ListingDocuments.html';
}

// ─── RESTORE SAVED STATE ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  try {
    const saved = JSON.parse(
      sessionStorage.getItem('drivelink_features_rules') || 'null'
    );
    if (!saved) return;

    // Restore features checkboxes
    if (Array.isArray(saved.features)) {
      saved.features.forEach(val => {
        const cb = document.querySelector(`input[name="features"][value="${val}"]`);
        if (cb) cb.checked = true;
      });
    }

    // Restore rules
    const r = saved.rules || {};
    if (r.smoking)           setRule('smokingGroup', r.smoking);
    if (r.pets)              setRule('petsGroup', r.pets);
    if (r.kmLimit != null)   document.getElementById('kmLimit').value = r.kmLimit || '';
    if (r.extraKmRate != null) document.getElementById('extraKm').value = r.extraKmRate || '';
    if (r.minDriverAge)      document.getElementById('minAge').value = r.minDriverAge;
    if (r.lateReturnFee != null) document.getElementById('lateFee').value = r.lateReturnFee || '';
    if (r.additionalDrivers != null)
      document.getElementById('additionalDrivers').checked = r.additionalDrivers;

  } catch {
    // Nothing to restore
  }
});
