import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  BarChart,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import PropTypes from "prop-types";

const Sidebar = ({
  isCollapsed,
  toggleSidebar,
  isMobile,
  showMobileSidebar,
  closeMobileSidebar,
}) => {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Products", icon: Package, path: "/products" },
    { name: "Orders", icon: ShoppingCart, path: "/orders" },
    { name: "Customers", icon: Users, path: "/customers" },
    { name: "Analytics", icon: BarChart, path: "/analytics" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const sidebarClasses = twMerge(
    "fixed top-0 left-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-all duration-300 z-50 flex flex-col",
    isMobile
      ? showMobileSidebar
        ? "translate-x-0 w-64"
        : "-translate-x-full w-64"
      : isCollapsed
      ? "w-20"
      : "w-64"
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Component */}
      <aside className={sidebarClasses}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
          <div
            className={twMerge(
              "flex items-center gap-2 overflow-hidden",
              isCollapsed && !isMobile && "w-0"
            )}
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="font-bold text-xl text-slate-800 dark:text-white whitespace-nowrap">
              Santos
            </span>
          </div>

          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight size={20} />
              ) : (
                <ChevronLeft size={20} />
              )}
            </button>
          )}

          {isMobile && (
            <button
              onClick={closeMobileSidebar}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors ml-auto"
            >
              <ChevronLeft size={20} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                twMerge(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                )
              }
            >
              <item.icon size={20} className="shrink-0" />
              <span
                className={twMerge(
                  "whitespace-nowrap transition-all duration-300 font-medium",
                  isCollapsed && !isMobile
                    ? "opacity-0 w-0 overflow-hidden"
                    : "opacity-100 w-auto"
                )}
              >
                {item.name}
              </span>

              {/* Tooltip for collapsed state */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                  {item.name}
                </div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            className={twMerge(
              "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors group relative",
              isCollapsed && !isMobile ? "justify-center" : ""
            )}
          >
            <LogOut size={20} className="shrink-0" />
            <span
              className={twMerge(
                "whitespace-nowrap transition-all duration-300 font-medium",
                isCollapsed && !isMobile
                  ? "opacity-0 w-0 overflow-hidden"
                  : "opacity-100 w-auto"
              )}
            >
              Logout
            </span>

            {/* Tooltip for collapsed state */}
            {isCollapsed && !isMobile && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

Sidebar.propTypes = {
  isCollapsed: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  showMobileSidebar: PropTypes.bool.isRequired,
  closeMobileSidebar: PropTypes.func.isRequired,
};

export default Sidebar;
