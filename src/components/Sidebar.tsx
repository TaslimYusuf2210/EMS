import { Link, useLocation } from "react-router-dom";
import { useGetCurrentUser } from "../hooks/useQuery/useGetCurrentUser";

interface SidebarProps {
  onClose?: () => void;
  isDrawer?: boolean;
}

export default function Sidebar({ onClose, isDrawer = false }: SidebarProps) {
  const { data: currentUser } = useGetCurrentUser();
  console.log('Current user data in Sidebar:', currentUser);
  const location = useLocation();
  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
    },
    {
      name: "Employees",
      path: "/dashboard/employees",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      name: "Departments",
      path: "/dashboard/departments",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
          />
        </svg>
      ),
    },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      name: "Settings",
      path: "/dashboard/settings",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
  ];

  function handleLogout() {
    // Clear user data from localStorage or any other storage mechanism
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    // Redirect to login page
    window.location.href = "/login";
  }
  return (
    <div
      className={`flex flex-col h-full bg-white border-r border-neutral-200 transition-all duration-300 ease-in-out
        lg:w-64 lg:p-5 lg:sticky lg:top-0 lg:left-0 lg:relative lg:z-0
        md:fixed md:top-0 md:left-0 md:h-screen md:w-20 md:hover:w-64 md:p-0 md:overflow-hidden group md:z-50
        ${isDrawer ? "p-5" : "max-md:hidden"}`}
    >
      {/* Brand Logo Header */}
      <div className="flex items-center justify-between pb-6 border-b border-neutral-100 md:px-3.5 md:py-5 md:pb-3 lg:pb-6">
        {/* Logo Icon - Always visible */}
        <div className="w-8 h-8 bg-[#ccd5ae] rounded-lg flex items-center justify-center text-neutral-950 font-black text-lg flex-shrink-0">
          S
        </div>

        {/* Brand text - Hidden on mobile/tablet default state, show on hover */}
        <span className={`${isDrawer ? "inline" : "hidden md:hidden md:group-hover:inline lg:inline"} font-extrabold text-lg tracking-tight`}>
          StaffSync
        </span>
      </div>

      {/* Org Name - Hidden on mobile/tablet collapsed state */}
      <div className={`${isDrawer ? "flex" : "hidden md:hidden md:group-hover:flex lg:flex"} my-5 bg-[#fefae0] border border-neutral-100 rounded-xl p-3 items-center justify-between`}>
        <div>
          <h4 className="font-bold text-xs text-neutral-900">
            {currentUser?.data?.company?.name}
          </h4>
          <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
            {currentUser?.data?.company?.description}
          </p>
        </div>
        <div className="w-2.5 h-2.5 bg-[#ccd5ae] rounded-full" />
      </div>

      {/* Links list */}
      <nav className="flex-1 space-y-1.5 mt-2 md:space-y-3 md:px-3.5 md:mt-4 md:overflow-y-auto">
        <span className={`${isDrawer ? "block" : "hidden md:hidden md:group-hover:block lg:block"} text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 px-2`}>
          Main Menu
        </span>

        {navItems.map((item) => {
          const isActive =
            item.path === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.path);

          return (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => {
                onClose?.();
              }}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all
                ${!isDrawer ? "md:justify-center md:w-12 md:h-12 md:p-0 md:group-hover:justify-start md:group-hover:w-full md:group-hover:px-3 lg:justify-start lg:w-full lg:h-auto lg:px-3 lg:py-2.5" : ""}
                ${
                  isActive
                    ? "bg-[#ccd5ae] text-neutral-950 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-950 hover:bg-[#fefae0]"
                }
              `}
              title={item.name}
            >
              <span className="flex-shrink-0">
                {item.icon}
              </span>
              <span className={`${isDrawer ? "inline" : "hidden md:hidden md:group-hover:inline lg:inline"} whitespace-nowrap`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Logout button at bottom */}
      <div className="pt-5 border-t border-neutral-100 md:px-3.5 md:pb-4">
        <Link
          to="/login"
          className={`
            flex items-center gap-3 px-3 py-2.5 text-neutral-500 hover:text-red-600 rounded-xl text-sm font-bold transition-all
            ${!isDrawer ? "md:justify-center md:w-12 md:h-12 md:p-0 md:group-hover:justify-start md:group-hover:w-full md:group-hover:px-3 lg:justify-start lg:w-full lg:h-auto lg:px-3 lg:py-2.5" : ""}
          `}
          title="Logout"
        >
          <span className="flex-shrink-0">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </span>
          <span
          onClick={handleLogout}
          className={`${isDrawer ? "inline" : "hidden md:hidden md:group-hover:inline lg:inline"} whitespace-nowrap`}>
            Logout
          </span>
        </Link>
      </div>
    </div>
  );
}
