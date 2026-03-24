import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/sidebar";
import Topbar from "../../components/layout/topbar";
import Footer from "../../components/layout/footer";
import EventGrid from "../../components/events/eventGrid";
import StatCard from "../../components/ui/statCard";
import type { EventItem, SidebarLink, SidebarSection } from "../../types";
import "../../styles/pages/adminHome.css";

export default function OrganiserHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigate = useNavigate();

  const sections: SidebarSection[] = [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "/organiser-home" },
        { label: "Browse Events", href: "/browse-events" },
        { label: "Categories", href: "/browse-events" },
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
    {
      label: "Organiser",
      links: [
        { label: "Overview", href: "/organiser-home", active: true },
        { label: "Create Event", href: "/create-event" },
        { label: "My Events", href: "/my-events" },
        { label: "Attendees", href: "/attendees" },
        { label: "Analytics", href: "/analytics" },
      ],
    },
  ];

  const bottomLinks: SidebarLink[] = [
    { label: "Settings", href: "/settings" },
    { label: "Logout", href: "/logout" },
  ];

  const myEvents: EventItem[] = [
    {
      id: 1,
      category: "Active",
      title: "Developer Meetup",
      description: "Currently open and attracting registrations.",
      date: "March 28, 2026",
      time: "5:00 PM - 8:00 PM",
      location: "Innovation Hub",
      imageClass: "tech-image",
      buttonText: "Manage Event",
    },
    {
      id: 2,
      category: "Upcoming",
      title: "Women in Business Forum",
      description: "Scheduled and ready for attendee engagement.",
      date: "April 2, 2026",
      time: "10:00 AM - 2:00 PM",
      location: "Masa Square",
      imageClass: "business-image",
      buttonText: "Manage Event",
    },
  ];

  const handleEventAction = (event: EventItem) => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sections={sections}
        bottomLinks={bottomLinks}
      />

      <main className="main">
        <Topbar
          title="Welcome Back, Organiser"
          subtitle="Manage your events, track engagement, and create new experiences from one place."
          onMenuClick={() => setSidebarOpen(true)}
          showSponsor
        />

        <section className="hero-grid admin-hero-grid">
          <div className="hero-card large-card">
            <p className="small-tag">Quick Action</p>
            <h2>Create and Manage Events Easily</h2>
            <p>
              Launch a new event, update existing ones, and keep track of attendee
              activity without leaving your dashboard.
            </p>
            <button onClick={() => navigate("/create-event")}>Create Event</button>
          </div>

          <StatCard value="08" label="Active Events" />
          <StatCard value="1,248" label="Total Attendees" />
          <StatCard value="87%" label="Engagement Rate" />
        </section>

        <section className="content-section">
          <div className="section-head">
            <h2>My Events</h2>
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/my-events")}
            >
              See all
            </button>
          </div>

          {myEvents.length > 0 ? (
            <EventGrid events={myEvents} onEventAction={handleEventAction} />
          ) : (
            <div className="empty-state">
              <h3>No events created yet</h3>
              <p>Start by creating your first event.</p>
              <button className="primary-btn" onClick={() => navigate("/create-event")}>
                Create Event
              </button>
            </div>
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
}