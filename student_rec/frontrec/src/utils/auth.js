// src/utils/auth.js

// ✅ Get current logged-in user object
export function getCurrentUser() {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
  
  // ✅ Check if a user is logged in
  export function isLoggedIn() {
    return !!getCurrentUser();
  }
  
  // ✅ Check if current user is admin
  export function isAdmin() {
    const user = getCurrentUser();
    return user?.role === 'admin';
  }
  
  // ✅ Clear user from localStorage
  export function logout() {
    localStorage.removeItem('user');
  }
  