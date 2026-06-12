/* ══════════════════════════════
   USERS FROM DATABASE
══════════════════════════════ */
let USERS = [];
let filteredUsers = [];

/* ══════════════════════════════
   LOAD USERS FROM DATABASE
══════════════════════════════ */
async function loadUsers() {

  try {

    const response = await fetch("fetch_users.php");

    USERS = await response.json();

    /* Convert database users into your existing UI format */
    USERS = USERS.map((u, index) => {

      const initials =
        (u.first_name?.charAt(0) || '') +
        (u.last_name?.charAt(0) || '');

      return {
        id: '#U-' + String(u.id).padStart(4, '0'),

        name: `${u.first_name} ${u.last_name}`,

        since:
          'Member since ' +
          new Date(u.created_at).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
          }),

        email: u.email,

        phone: u.phone,

        verification: 'verified',

        status: 'active',

        role: 'Renter',

        initials: initials.toUpperCase()
      };
    });

    filteredUsers = [...USERS];

    renderTable();

    updateStats();

  } catch (error) {

    console.error("Error loading users:", error);

  }
}

/* ══════════════════════════════
   UPDATE STATS
══════════════════════════════ */
function updateStats() {

  document.getElementById('statTotal').textContent =
    USERS.length.toLocaleString();

  document.getElementById('statPending').textContent = '0';

  document.getElementById('statActive').textContent =
    USERS.length.toLocaleString();

  document.getElementById('statBanned').textContent = '0';
}