// ✅ Backend API URL - your local server
const API_BASE = 'http://192.168.50.219/student_rec/rec/api';
//const API_BASE = 'http://localhost/student_rec/rec/api';


/**
 * Generic request handler
 */
async function request(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      body: options.body || null,
      mode: 'cors',
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(`❌ Server Error (${response.status}): ${text}`);
      throw new Error(`Server responded with ${response.status}`);
    }

    const text = await response.text();
    try {
      return JSON.parse(text);
    } catch {
      console.error('⚠️ Invalid JSON from server:', text);
      throw new Error('Invalid JSON response from server');
    }

  } catch (err) {
    console.error('🚨 API Request Error:', err.message);
    throw err;
  }
}

//
// 🔐 AUTHENTICATION
//
export async function loginUser(credentials) {
  return request('/login.php', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export async function logoutUser() {
  return request('/logout.php');
}

//
// 👥 ACCOUNT MANAGEMENT
//
export async function fetchUsers() {
  return request('/users.php');
}

export async function createAccount(data) {
  return request('/create_account.php', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAccount(id, data) {
  return request('/update_account.php', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteAccount(id) {
  const user_id = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');

  return request('/delete_account.php', {
    method: 'DELETE',
    body: JSON.stringify({ id, user_id, username }),
  });
}

//
// 🧑‍🎓 STUDENT RECORDS
//
export async function fetchStudents() {
  return request('/students.php');
}

export async function createStudent(data) {
  const user_id = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');

  return request('/create_user.php', {
    method: 'POST',
    body: JSON.stringify({ ...data, user_id, username }),
  });
}

export async function updateStudent(id, data) {
  const user_id = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');

  return request('/update.php', {
    method: 'PUT',
    body: JSON.stringify({
      id,
      ...data,
      user_id,
      username,
    }),
  });
}

export async function deleteStudent(id) {
  const user_id = localStorage.getItem('user_id');
  const username = localStorage.getItem('username');

  return request('/delete.php', {
    method: 'DELETE',
    body: JSON.stringify({ id, user_id, username }),
  });
}

//
// 📤 EXPORT
//
export async function exportStudents() {
  return fetch(`${API_BASE}/export.php`);
}
