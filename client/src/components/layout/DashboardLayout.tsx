import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { getSidebarSections } from "../../utils/getSidebarSections";
import { useAuth } from "../../context/AuthContext";
import type { SidebarLink } from "../../types";

interface DashboardLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  showSponsor?: boolean;
}

export default function DashboardLayout({
  title,
  subtitle,
  children,
  showSponsor = false,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { role, isAdmin, isLoading, setRole, clearRole, signOut } = useAuth();
  const navigate = useNavigate();

  const sections = getSidebarSections(isAdmin);

  const bottomLinks: SidebarLink[] = [
    { label: "Settings", href: "/settings" },
    { label: role ? "Logout" : "Sign in", href: role ? "/logout" : "/login" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sections={sections}
        bottomLinks={bottomLinks}
        onLogout={handleLogout}
      />

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-60">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          showSponsor={showSponsor}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

        <Footer />
      </div>

      {import.meta.env.DEV && (
        <div className="fixed bottom-4 right-4 z-50 flex gap-2 rounded-2xl border border-gray-200 bg-white p-2 shadow-lg text-xs">
          <button
            type="button"
            onClick={() => setRole("user")}
            className={`rounded-xl px-3 py-1.5 font-medium transition-colors ${
              role === "user" ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            User
          </button>
          <button
            type="button"
            onClick={() => setRole("admin")}
            className={`rounded-xl px-3 py-1.5 font-medium transition-colors ${
              role === "admin" ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            Admin
          </button>
          <button
            type="button"
            onClick={() => clearRole()}
            className="rounded-xl px-3 py-1.5 font-medium text-gray-500 hover:bg-gray-100"
          >
            Guest
          </button>
        </div>
      )}
    </div>
  );
}