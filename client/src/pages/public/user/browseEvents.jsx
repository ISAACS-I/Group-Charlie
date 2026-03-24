import { useState } from "react";
import Sidebar from "../../components/layout/sideBar";
import Topbar from "../../components/layout/topBar";
import Footer from "../../components/layout/footer";
import EventGrid from "../../components/events/EventGrid";
import "../../styles/pages/browseEvents.css";

export default function BrowseEvents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarSections = [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "#" },
        { label: "Browse Events", href: "#", active: true },
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
  ];

  const bottomLinks = [
    { label: "Settings", href: "#" },
    { label: "Logout", href: "#" },
  ];

  const events = [
    {
      id: 1,
      category: "Technology",
      categoryClass: "tech",
      registered: "245 Registered",
      title: "Tech Innovation Summit 2026",
      description:
        "Join industry leaders for a day of innovation, networking, and cutting-edge technology.",
      date: "March 25, 2026",
      time: "9:00 AM - 6:00 PM",
      location: "Central Business District",
      price: "Free",
      tag: "Popular",
      imageClass: "tech-image",
    },
    {
      id: 2,
      category: "Arts & Culture",
      categoryClass: "art",
      registered: "89 Registered",
      title: "Contemporary Art Exhibition",
      description:
        "Experience the finest contemporary art from emerging and established local artists.",
      date: "March 28, 2026",
      time: "2:00 PM - 8:00 PM",
      location: "Thapong Café & Deli",
      price: "P25",
      imageClass: "art-image",
    },
    {
      id: 3,
      category: "Business",
      categoryClass: "business",
      registered: "156 Registered",
      title: "Startup Founders Meetup",
      description:
        "Connect with fellow entrepreneurs, share insights, and build valuable partnerships.",
      date: "April 2, 2026",
      time: "6:00 PM - 9:00 PM",
      location: "Innovation Hub Downtown",
      price: "P50",
      imageClass: "business-image",
    },
    {
      id: 4,
      category: "Sports",
      categoryClass: "sports",
      registered: "432 Registered",
      title: "FNB Kazungula Bridge Marathon 2026",
      description:
        "Join thousands of runners in the annual city marathon for health and community.",
      date: "April 10, 2026",
      time: "6:00 AM - 12:00 PM",
      location: "Kazungula Bridge",
      price: "P80",
      imageClass: "sports-image",
    },
    {
      id: 5,
      category: "Music",
      categoryClass: "music",
      registered: "678 Registered",
      title: "Lekompo Summer Music Festival",
      description:
        "Three days of incredible live performances from top lekompo artists.",
      date: "November 15-17, 2026",
      time: "12:00 PM - 11:00 PM",
      location: "Serowe",
      price: "P100",
      tag: "Featured",
      imageClass: "music-image",
    },
    {
      id: 6,
      category: "Food & Drink",
      categoryClass: "food",
      registered: "34 Registered",
      title: "Gourmet Cooking Workshop",
      description:
        "Learn professional cooking techniques from Chef Seeletso in hands-on sessions.",
      date: "July 5, 2026",
      time: "3:00 PM - 7:00 PM",
      location: "Cresta Hotel and Restaurant",
      price: "P250",
      imageClass: "food-image",
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
          title="Browse Events"
          subtitle="Discover and register for upcoming events using your unique QR-based registration."
          onMenuClick={() => setSidebarOpen(true)}
          showSponsor={true}
        />

        <section className="hero-banner">
          <div className="hero-content">
            <h2>Discover Amazing Events</h2>
            <p>Register once, attend multiple events with your unique QR code.</p>

            <div className="hero-pills">
              <div className="hero-pill">
                <span className="hero-pill-title">Quick Check-in</span>
                <span className="hero-pill-sub">Scan & Go</span>
              </div>

              <div className="hero-pill">
                <span className="hero-pill-title">Secure Registration</span>
                <span className="hero-pill-sub">One-time Setup</span>
              </div>
            </div>
          </div>
        </section>

        <section className="filters-card">
          <div className="filter-group">
            <label>Category</label>
            <select>
              <option>All Categories</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date</label>
            <select>
              <option>All Dates</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select>
              <option>All Locations</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input type="text" placeholder="Search events..." />
          </div>
        </section>

        <section className="section-head">
          <h2>Upcoming Events</h2>

          <div className="view-toggle">
            <button className="toggle-btn active">Grid</button>
            <button className="toggle-btn">List</button>
          </div>
        </section>

        <EventGrid events={events} />

        <Footer />
      </main>
    </div>
  );
}