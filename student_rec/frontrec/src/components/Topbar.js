import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { getCurrentUser, logout } from '../utils/auth';

export default function Topbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getCurrentUser());
  }, []);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-full px-4 pt-4">
      {/* Desktop */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md h-[56px] px-4 hidden lg:flex items-center justify-end relative">
        <div
          ref={profileRef}
          className="relative flex items-center gap-2 cursor-pointer"
          onClick={() => setProfileOpen(!profileOpen)}
        >
          {user && (
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {user.username}
            </span>
          )}
          <img
            src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
            alt="Profile"
            className="w-9 h-9 rounded-full object-cover"
          />

          {/* Dropdown */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 border border-gray-200 dark:border-gray-700">
              <div className="py-2 px-4 text-sm text-gray-600 dark:text-gray-300 border-b dark:border-gray-700">
                {user?.role === 'admin' ? 'Admin Account' : 'User Account'}
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile */}
      <div className="lg:hidden relative flex justify-end mt-1">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="z-50 bg-blue-600 text-white p-2 rounded-xl shadow-md"
        >
          <FaBars className="text-xl" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-[50px] w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-50 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700">
              <img
                src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                alt="Profile"
                className="w-8 h-8 rounded-full mr-3 object-cover"
              />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {user?.username || 'User'}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
