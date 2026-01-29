import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  Brain,
  BookOpen,
  X,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/documents", icon: FileText, label: "Documents" },
    { to: "/flashcards", icon: BookOpen, label: "Flashcards" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64
          bg-white border-r border-neutral-200
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b">
          <div className="flex items-center gap-2 font-semibold text-lg">
            <Brain className="text-slate-700" />
            <span>AI Learning</span>
          </div>

          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {navLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition
                 ${
                   isActive
                     ? "bg-slate-100 text-slate-900 font-medium"
                     : "text-neutral-600 hover:bg-neutral-100"
                 }`
              }
              onClick={() => toggleSidebar()}
            >
              <Icon size={20} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2
                       text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
