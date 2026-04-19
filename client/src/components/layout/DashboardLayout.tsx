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
  const { role, isAdmin, isLoading, user, signOut } = useAuth();
  const navigate = useNavigate();

  const sections = getSidebarSections(isAdmin);

  const bottomLinks: SidebarLink[] = [
    { label: "Settings", href: "/settings" },
    ...(role
      ? [{ label: "Logout", href: "/logout" }]
      : [{ label: "Sign In", href: "/login" }]),
  ];

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  if (isLoading) return null;

  return (
    <div className="relative min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sections={sections}
        bottomLinks={bottomLinks}
        onLogout={handleLogout}
      />

      <div className="flex min-h-screen flex-col">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          showSponsor={showSponsor}
          userName={user ? `${user.firstName} ${user.lastName}` : undefined}
          isLoggedIn={!!role}
          onLogin={() => navigate("/login")}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

        <Footer />
      </div>
    </div>
  );
}