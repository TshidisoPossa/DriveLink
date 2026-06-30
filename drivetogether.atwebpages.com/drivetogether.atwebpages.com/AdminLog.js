document.addEventListener('DOMContentLoaded', function () {
  const adminBtn = document.getElementById('adminBtn');
  if (adminBtn) {
    adminBtn.addEventListener('click', function () {
      window.location.href = 'AdminLogin.html';
    });
  }
});