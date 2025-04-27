import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';

export default function Layout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  return (
    <div className="h-screen overflow-hidden flex bg-[#eaf0f9] dark:bg-gray-900 relative text-gray-800 dark:text-gray-100">
      {/* Overlay for mobile */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar - Mobile */}
      <div
        className={`fixed top-0 left-0 h-full w-[220px] transform transition-transform duration-300 z-50 lg:hidden ${
          showSidebar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Sidebar />
      </div>

      {/* Mobile toggle button */}
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        className="fixed top-1/2 left-0 transform -translate-y-1/2 z-50 bg-blue-600 text-white p-2 rounded-r-full shadow-lg lg:hidden"
      >
        {showSidebar ? <FaChevronLeft /> : <FaChevronRight />}
      </button>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto px-1 py-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
