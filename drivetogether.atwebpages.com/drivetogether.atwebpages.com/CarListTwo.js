function previewPhoto(event, boxId, innerId) {
  var file  = event.target.files[0];
  var box   = document.getElementById(boxId);
  var inner = document.getElementById(innerId);

  if (!file) return;

  var reader = new FileReader();

  reader.onload = function (e) {
    // Remove existing preview if any
    clearPreview(box, inner);

    // Create preview image
    var img = document.createElement('img');
    img.src = e.target.result;
    img.alt = 'Car photo preview';
    img.className = 'preview-img';

    // Create remove button
    var removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-btn';
    removeBtn.innerHTML = '&times;';
    removeBtn.title = 'Remove photo';

    // When remove is clicked, clear the preview
    removeBtn.addEventListener('click', function (ev) {
      ev.preventDefault();
      ev.stopPropagation();
      clearPreview(box, inner);
      // Reset the file input
      var inputId = 'input-' + boxId.replace('box-', '');
      var fileInput = document.getElementById(inputId);
      if (fileInput) fileInput.value = '';
    });

    // Append to the box
    box.appendChild(img);
    box.appendChild(removeBtn);

    // Hide the inner placeholder content
    inner.style.display = 'none';

    // Mark box as uploaded
    box.classList.add('uploaded');
    box.classList.remove('required-error');
  };

  reader.readAsDataURL(file);

  // Reset input so same file can be re-selected
  event.target.value = '';
}

/* ──────────────────────────────────────
   CLEAR PREVIEW
   This will remove the preview image and restore
   the upload placeholder.
   ────────────────────────────────────── */
function clearPreview(box, inner) {
  // Remove any existing preview image
  var existingImg = box.querySelector('.preview-img');
  if (existingImg) existingImg.remove();

  // Remove existing remove button
  var existingBtn = box.querySelector('.remove-btn');
  if (existingBtn) existingBtn.remove();

  // Show the placeholder content again
  inner.style.display = 'flex';

  // Remove uploaded state
  box.classList.remove('uploaded');
}

/* ──────────────────────────────────────
    
   This will Check that front and rear photos are
   uploaded before allowing continuation.
   ────────────────────────────────────── */
function validateRequired() {
  var allValid = true;

  var requiredSlots = [
    { boxId: 'box-front', labelId: 'slot-front' },
    { boxId: 'box-rear',  labelId: 'slot-rear'  }
  ];

  requiredSlots.forEach(function (slot) {
    var box   = document.getElementById(slot.boxId);
    var label = document.querySelector('#' + slot.labelId + ' .slot-label');

    if (!box.classList.contains('uploaded')) {
      box.classList.add('required-error');
      if (label) label.classList.add('error-label');
      allValid = false;
    } else {
      box.classList.remove('required-error');
      if (label) label.classList.remove('error-label');
    }
  });

  return allValid;
}

/* ──────────────────────────────────────
   
   Validates required fields then
   redirects to the next step.
   ────────────────────────────────────── */
function saveAndContinue() {
  var isValid = validateRequired();

  if (!isValid) {
    alert('Please upload the required photos (Exterior Front and Rear) before continuing.');
    return;
  }

  // ── Replace this with your actual next page ──
  // window.location.href = 'pricing.html';
  alert('Photos saved! Proceeding to Step 3: Pricing & Availability.');
}
