import { useState, type ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Footer from "./Footer";
import { useAuth } from "../../context/authContext";
import type { SidebarLink, SidebarSection } from "../../types";

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
  const { isAdmin, isLoading } = useAuth();

  const sections: SidebarSection[] = [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "/home" },
        { label: "Browse Events", href: "/browse-events" },
        { label: "Categories", href: "/categories" },
      ],
    },
    {
      label: "Personal",
      links: [
        { label: "My Bookings", href: "/my-bookings" },
        { label: "Saved Events", href: "/saved-events" },
        { label: "QR Codes", href: "/qr-codes" },
      ],
    },
  ];

  if (isAdmin) {
    sections.push({
      label: "Organiser",
      links: [
        { label: "Overview", href: "/organiser-home" },
        { label: "Create Event", href: "/create-event" },
        { label: "My Events", href: "/my-events" },
        { label: "Attendees", href: "/attendees" },
        { label: "Analytics", href: "/analytics" },
      ],
    });
  }

  const bottomLinks: SidebarLink[] = [
    { label: "Settings", href: "/settings" },
    { label: isAdmin ? "Logout" : "Sign in", href: isAdmin ? "/logout" : "/login" },
  ];

  if (isLoading) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sections={sections}
        bottomLinks={bottomLinks}
      />

      <div className="flex min-h-screen min-w-0 flex-col">
        <Topbar
          title={title}
          subtitle={subtitle}
          onMenuClick={() => setSidebarOpen(true)}
          showSponsor={showSponsor}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">{children}</main>

        <Footer />
      </div>
    </div>
  );
}