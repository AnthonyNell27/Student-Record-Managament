// src/components/Sidebar.js
import { useEffect, useState } from 'react';
import { FaHome, FaUsers, FaMoon, FaSun, FaHistory } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../utils/auth';

export default function Sidebar() {
  const user = getCurrentUser();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const menu = [
    { icon: <FaHome />, label: 'Home', path: '/' },
  ];

  return (
    <aside className="w-[220px] bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 h-[calc(100vh-32px)] rounded-2xl mx-3 my-4 shadow-md py-4 px-4 flex flex-col justify-between">
      <div>
        <h1 className="text-xl font-extrabold text-blue-600 dark:text-blue-400 mb-5">SmS</h1>

        <nav className="space-y-3 text-[14px]">
          {menu.map((item, i) => (
            <Link
              key={i}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white transition-all"
            >
              <span className="text-lg">{item.icon}</span>
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          ))}

          {user?.role === 'admin' && (
            <>
              <Link
                to="/account-management"
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white transition-all"
              >
                <FaUsers className="text-lg" />
                <span>Manage Accounts</span>
              </Link>

              <Link
                to="/audit-log"
                className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-white transition-all"
              >
                <FaHistory className="text-lg" />
                <span>Audit Logs</span>
              </Link>
            </>
          )}
        </nav>
      </div>

      {/* Toggle at bottom */}
      <div className="flex items-center justify-between mt-6 text-sm text-gray-600 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700 pt-4">
        <span className="flex items-center gap-2">
          {darkMode ? <FaMoon /> : <FaSun />}
          Dark Mode
        </span>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>
    </aside>
  );
}
