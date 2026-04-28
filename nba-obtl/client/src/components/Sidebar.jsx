import { BarChart3, BookOpenCheck, FileText, LogOut } from "lucide-react";
import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/", label: "Dashboard", icon: BarChart3 },
  { to: "/criterion-2", label: "Criterion 2 Sections", icon: BookOpenCheck },
  { to: "/reports", label: "Reports", icon: FileText }
];

function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <aside className="glass-panel flex h-full flex-col gap-6 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">NBA Portal</p>
        <h1 className="mt-2 text-2xl font-bold text-ink">Criterion 2</h1>
        <p className="mt-2 text-sm text-slate-600">
          Outcome Based Teaching Learning workspace for teachers and admins.
        </p>
      </div>

      <div className="rounded-3xl bg-slate-900 px-4 py-4 text-white">
        <p className="text-sm text-slate-300">{isAdmin ? "Administrator" : "Teacher"}</p>
        <p className="mt-1 text-lg font-semibold">{user?.name}</p>
        <p className="text-sm text-slate-300">{user?.department || "Department not set"}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                  isActive ? "bg-blue-50 text-brand" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <button type="button" onClick={logout} className="button-secondary w-full gap-2">
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;
