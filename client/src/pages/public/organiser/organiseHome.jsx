import { useState } from "react-reacter";
import Sidebar from "../../components/layout/sideBar";
import Topbar from "../../components/layout/topBar";
import Footer from "../../components/layout/footer";
import EventGrid from "../../components/events/eventGrid";
import StatCard from "../../components/ui/statCard";
import "../../styles/pages/organiserHome.css";

export default function OrganiserHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarSections = [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "#" },
        { label: "Browse Events", href: "#" },
        { label: "Categories", href: "#" },
      ],
    },
    {
      label: "Personal",
      links: [
        { label: "My Bookings", href: "#" },
        { label: "Saved Events", href: "#" },
        { label: "QR Codes", href: "#" },
      ],
    },
    {
      label: "Organiser",
      links: [
        { label: "Overview", href: "#", active: true },
        { label: "Create Event", href: "#" },
        { label: "My Events", href: "#" },
        { label: "Attendees", href: "#" },
        { label: "Analytics", href: "#" },
      ],
    },
  ];

  const bottomLinks = [
    { label: "Settings", href: "#" },
    { label: "Logout", href: "#" },
  ];

  const myEvents = [
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
    {
      id: 3,
      category: "Draft",
      title: "Live Music Night",
      description: "Awaiting final confirmation and publishing.",
      date: "TBA",
      time: "TBA",
      location: "TBA",
      imageClass: "music-image",
      buttonText: "Edit Draft",
    },
  ];

  return (
    <div className="app">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sections={sidebarSections}
        bottomLinks={bottomLinks}
      />

      <main className="main">
        <Topbar
          title="Welcome Back, Organiser"
          subtitle="Manage your events, track engagement, and create new experiences from one place."
          onMenuClick={() => setSidebarOpen(true)}
          showSponsor={true}
        />

        <section className="search-section">
          <div className="search-box">
            <input type="text" placeholder="Search events, categories, or locations..." />
            <button>Search</button>
          </div>

          <div className="filter-chips">
            <span>Technology</span>
            <span>Music</span>
            <span>Business</span>
            <span>Sports</span>
            <span>Community</span>
          </div>
        </section>

        <section className="hero-grid admin-hero-grid">
          <div className="hero-card large-card">
            <p className="small-tag">Quick Action</p>
            <h2>Create and Manage Events Easily</h2>
            <p>
              Launch a new event, update existing ones, and keep track of attendee
              activity without leaving your dashboard.
            </p>
            <button>Create Event</button>
          </div>

          <StatCard value="08" label="Active Events" />
          <StatCard value="1,248" label="Total Attendees" />
          <StatCard value="87%" label="Engagement Rate" />
        </section>

        <section className="content-section">
          <div className="section-head">
            <h2>Quick Actions</h2>
          </div>

          <div className="quick-actions">
            <div className="action-card">
              <h3>Create Event</h3>
              <p>Start a new event listing with dates, venue, and ticket details.</p>
            </div>

            <div className="action-card">
              <h3>Manage Attendees</h3>
              <p>Review registrations and monitor attendance activity.</p>
            </div>

            <div className="action-card">
              <h3>View Analytics</h3>
              <p>Check performance, engagement, and event reach.</p>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="section-head">
            <h2>My Events</h2>
            <a href="#">See all</a>
          </div>

          <EventGrid events={myEvents} />
        </section>

        <section className="why-join-section">
          <div className="section-head">
            <h2>Organiser Insights</h2>
          </div>

          <div className="why-join-grid">
            <div className="why-card">
              <h3>Attendance Overview</h3>
              <p>Track how many people are registering and attending across your active events.</p>
            </div>

            <div className="why-card">
              <h3>Event Performance</h3>
              <p>See which events are gaining the most interest and where engagement is strongest.</p>
            </div>

            <div className="why-card">
              <h3>Management Tools</h3>
              <p>Access event creation, attendee tracking, and analytics from the same workspace.</p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}