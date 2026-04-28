import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

function AppShell() {
  return (
    <div className="min-h-screen px-4 py-4 lg:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl gap-4 lg:grid-cols-[300px_1fr]">
        <Sidebar />
        <main className="glass-panel overflow-hidden p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AppShell;
