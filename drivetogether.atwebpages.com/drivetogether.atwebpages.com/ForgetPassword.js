
// ── Step 1: Check if email exists ──
function checkEmail() {
  const emailInput = document.getElementById('emailInput');
  const emailError = document.getElementById('emailError');
  const email      = emailInput.value.trim();

  // Reset error
  emailError.textContent = '';
  emailInput.classList.remove('error');

  // Basic format check
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    emailError.textContent = 'Please enter your email address.';
    emailInput.classList.add('error');
    return;
  }
  if (!emailRe.test(email)) {
    emailError.textContent = 'Please enter a valid email address.';
    emailInput.classList.add('error');
    return;
  }

  // Send to PHP to check if email exists
  const payload = new FormData();
  payload.append('action', 'check_email');
  payload.append('email', email);

  fetch('ForgotPassword.php', { method: 'POST', body: payload })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        // Store email for step 2
        sessionStorage.setItem('reset_email', email);
        // Show verified badge with email
        document.getElementById('verifiedEmail').textContent = email;
        // Switch to step 2
        showStep(2);
      } else {
        emailError.textContent = data.message || 'No account found with that email.';
        emailInput.classList.add('error');
      }
    })
    .catch(() => {
      emailError.textContent = 'Network error. Please try again.';
      emailInput.classList.add('error');
    });
}

// ── Step 2: Update password ──
function resetPassword() {
  const newPwd     = document.getElementById('newPassword').value;
  const confirmPwd = document.getElementById('confirmPassword').value;
  const newErr     = document.getElementById('newPwdError');
  const confErr    = document.getElementById('confirmPwdError');
  const email      = sessionStorage.getItem('reset_email') || '';

  // Reset errors
  newErr.textContent  = '';
  confErr.textContent = '';
  document.getElementById('newPassword').classList.remove('error');
  document.getElementById('confirmPassword').classList.remove('error');

  let valid = true;

  if (newPwd.length < 8) {
    newErr.textContent = 'Password must be at least 8 characters.';
    document.getElementById('newPassword').classList.add('error');
    valid = false;
  }

  if (!confirmPwd) {
    confErr.textContent = 'Please confirm your new password.';
    document.getElementById('confirmPassword').classList.add('error');
    valid = false;
  } else if (newPwd !== confirmPwd) {
    confErr.textContent = 'Passwords do not match.';
    document.getElementById('confirmPassword').classList.add('error');
    valid = false;
  }

  if (!valid) return;

  // Send to PHP to update password
  const payload = new FormData();
  payload.append('action',   'update_password');
  payload.append('email',    email);
  payload.append('password', newPwd);

  fetch('ForgotPassword.php', { method: 'POST', body: payload })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        sessionStorage.removeItem('reset_email');
        showStep(3);
      } else {
        newErr.textContent = data.message || 'Something went wrong. Please try again.';
      }
    })
    .catch(() => {
      newErr.textContent = 'Network error. Please try again.';
    });
}

// ── Step switcher ──
function showStep(step) {
  document.getElementById('step1').style.display = step === 1 ? 'block' : 'none';
  document.getElementById('step2').style.display = step === 2 ? 'block' : 'none';
  document.getElementById('step3').style.display = step === 3 ? 'block' : 'none';
}

// ── Go back to step 1 ──
function goBack() {
  document.getElementById('emailInput').value = '';
  document.getElementById('emailError').textContent = '';
  document.getElementById('newPassword').value    = '';
  document.getElementById('confirmPassword').value = '';
  document.getElementById('newPwdError').textContent  = '';
  document.getElementById('confirmPwdError').textContent = '';
  resetStrengthBar();
  showStep(1);
}

// ── Password visibility toggle ──
function togglePwd(inputId, iconId) {
  var input = document.getElementById(inputId);
  var icon  = document.getElementById(iconId);
  var show  = input.type === 'password';
  input.type = show ? 'text' : 'password';
  icon.innerHTML = show
    ? '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/>'
    : '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
}

// ── Password strength checker ──
function checkStrength() {
  var pwd    = document.getElementById('newPassword').value;
  var fill   = document.getElementById('strengthFill');
  var label  = document.getElementById('strengthLabel');
  var score  = 0;

  if (pwd.length >= 8)                    score++;
  if (/[A-Z]/.test(pwd))                 score++;
  if (/[0-9]/.test(pwd))                 score++;
  if (/[^A-Za-z0-9]/.test(pwd))         score++;

  var configs = [
    { pct: '0%',   color: 'transparent', text: '',          textColor: 'transparent' },
    { pct: '25%',  color: '#ef4444',     text: 'Weak',       textColor: '#ef4444' },
    { pct: '50%',  color: '#f97316',     text: 'Fair',       textColor: '#f97316' },
    { pct: '75%',  color: '#eab308',     text: 'Good',       textColor: '#eab308' },
    { pct: '100%', color: '#16a34a',     text: 'Strong',     textColor: '#16a34a' },
  ];

  var cfg = configs[score];
  fill.style.width      = cfg.pct;
  fill.style.background = cfg.color;
  label.textContent     = cfg.text;
  label.style.color     = cfg.textColor;
}

function resetStrengthBar() {
  document.getElementById('strengthFill').style.width = '0%';
  document.getElementById('strengthLabel').textContent = '';
}

// ── Allow Enter key on email input ──
document.addEventListener('DOMContentLoaded', function () {
  var emailInput = document.getElementById('emailInput');
  if (emailInput) {
    emailInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') checkEmail();
    });
  }
});
