import { useState, useEffect } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import { ChevronRight, Home } from "lucide-react";
import { twMerge } from "tailwind-merge";

const AdminLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved === "true";
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileSidebarOpen(false);
      }
    };

    // Initial check
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", isSidebarCollapsed);
  }, [isSidebarCollapsed]);

  // Close mobile sidebar on route change
//   useEffect(() => {
//     setIsMobileSidebarOpen(false);
//   }, [location.pathname]);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Generate page title and breadcrumbs based on path
  const getPageInfo = () => {
    const path = location.pathname;
    if (path === "/") return { title: "Dashboard", crumbs: [] };

    // Simple logic to convert path to title (e.g. /products/add -> Products / Add)
    const segments = path.split("/").filter(Boolean);
    const title =
      segments[0]?.charAt(0).toUpperCase() + segments[0]?.slice(1) || "Page";

    const crumbs = segments.map((segment, index) => ({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: "/" + segments.slice(0, index + 1).join("/"),
    }));

    return { title, crumbs };
  };

  const { title, crumbs } = getPageInfo();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
        isMobile={isMobile}
        showMobileSidebar={isMobileSidebarOpen}
        closeMobileSidebar={() => setIsMobileSidebarOpen(false)}
      />

      <div
        className={twMerge(
          "flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out",
          !isMobile ? (isSidebarCollapsed ? "ml-20" : "ml-64") : "ml-0"
        )}
      >
        <Header toggleMobileSidebar={toggleMobileSidebar} title={title} />

        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {/* Breadcrumbs */}
          <div className="mb-6 flex items-center text-sm text-slate-500 dark:text-slate-400">
            <Link
              to="/"
              className="hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1"
            >
              <Home size={16} />
            </Link>
            {crumbs.length > 0 && <ChevronRight size={14} className="mx-2" />}
            {crumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center">
                {index === crumbs.length - 1 ? (
                  <span className="font-medium text-slate-800 dark:text-slate-200">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    to={crumb.path}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                )}
                {index < crumbs.length - 1 && (
                  <ChevronRight size={14} className="mx-2" />
                )}
              </div>
            ))}
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
