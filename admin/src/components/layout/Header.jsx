import { useState } from "react";
import {
  Search,
  Bell,
  User,
  Sun,
  Moon,
  Menu,
  Settings,
  LogOut,
} from "lucide-react";
import PropTypes from "prop-types";
import { twMerge } from "tailwind-merge";

const Header = ({ toggleMobileSidebar, title }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // In a real app, this would use a context or helper to toggle the 'dark' class on html/body
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sticky top-0 z-30 transition-colors duration-300">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile Menu Trigger */}
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Page Title */}
        <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white truncate">
          {title}
        </h1>

        {/* Search Bar */}
        <div className="hidden md:flex items-center relative ml-4 lg:ml-8 max-w-sm w-full">
          <Search className="absolute left-3 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        {/* Mobile Search Trigger (optional, valid pattern if search hidden) - omitting for simplicity unless requested */}

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors relative overflow-hidden"
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          <div className="relative w-5 h-5">
            <Sun
              size={20}
              className={twMerge(
                "absolute transition-all duration-300 transform",
                isDarkMode
                  ? "opacity-0 rotate-90 scale-0"
                  : "opacity-100 rotate-0 scale-100"
              )}
            />
            <Moon
              size={20}
              className={twMerge(
                "absolute transition-all duration-300 transform",
                isDarkMode
                  ? "opacity-100 rotate-0 scale-100"
                  : "opacity-0 -rotate-90 scale-0"
              )}
            />
          </div>
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <User size={18} />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Admin User
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                admin@santos.com
              </p>
            </div>
          </button>

          {/* Dropdown Menu */}
          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg z-40 py-1 transition-all animate-in fade-in zoom-in-95 duration-200">
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                  <User size={16} /> Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                  <Settings size={16} /> Settings
                </button>
                <hr className="my-1 border-slate-200 dark:border-slate-800" />
                <button className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  toggleMobileSidebar: PropTypes.func.isRequired,
  title: PropTypes.string,
};

export default Header;
