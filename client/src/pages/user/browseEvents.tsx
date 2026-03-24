import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/sidebar";
import Topbar from "../../components/layout/topbar";
import Footer from "../../components/layout/footer";
import EventGrid from "../../components/events/eventGrid";
import type { EventItem, SidebarLink, SidebarSection } from "../../types";
import "../../styles/pages/browseEvents.css";

export default function BrowseEvents() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const navigate = useNavigate();

  const sections: SidebarSection[] = [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "/home" },
        { label: "Browse Events", href: "/browse-events", active: true },
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
  ];

  const bottomLinks: SidebarLink[] = [
    { label: "Settings", href: "/settings" },
    { label: "Logout", href: "/logout" },
  ];

  const events: EventItem[] = [
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
      buttonText: "View Event",
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
      buttonText: "View Event",
    },
    {
      id: 3,
      category: "Business",
      categoryClass: "business",
      registered: "134 Registered",
      title: "Women in Business Forum",
      description:
        "Network with founders, professionals, and aspiring leaders across industries.",
      date: "April 2, 2026",
      time: "10:00 AM - 2:00 PM",
      location: "Masa Square",
      price: "P50",
      imageClass: "business-image",
      buttonText: "View Event",
    },
    {
      id: 4,
      category: "Music",
      categoryClass: "music",
      registered: "98 Registered",
      title: "Live Acoustic Session",
      description:
        "Enjoy an intimate evening of acoustic performances from talented local artists.",
      date: "April 5, 2026",
      time: "7:00 PM - 10:00 PM",
      location: "Gaborone Club",
      price: "P80",
      imageClass: "music-image",
      buttonText: "View Event",
    },
  ];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory =
        selectedCategory === "All Categories" || event.category === selectedCategory;

      const matchesLocation =
        selectedLocation === "All Locations" || event.location === selectedLocation;

      const matchesDate =
        selectedDate === "All Dates" ||
        (selectedDate === "This Week" &&
          (event.date?.includes("March 25, 2026") || event.date?.includes("March 28, 2026"))) ||
        (selectedDate === "Next Week" &&
          (event.date?.includes("April 2, 2026") || event.date?.includes("April 5, 2026")));

      const search = searchTerm.toLowerCase();
      const matchesSearch =
        event.title.toLowerCase().includes(search) ||
        (event.description ?? "").toLowerCase().includes(search) ||
        (event.location ?? "").toLowerCase().includes(search) ||
        (event.category ?? "").toLowerCase().includes(search);

      return matchesCategory && matchesLocation && matchesDate && matchesSearch;
    });
  }, [events, selectedCategory, selectedDate, selectedLocation, searchTerm]);

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
          title="Browse Events"
          subtitle="Discover and register for upcoming events using your unique QR-based registration."
          onMenuClick={() => setSidebarOpen(true)}
          showSponsor
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
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option>All Categories</option>
              <option>Technology</option>
              <option>Arts & Culture</option>
              <option>Business</option>
              <option>Music</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Date</label>
            <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
              <option>All Dates</option>
              <option>This Week</option>
              <option>Next Week</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Location</label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option>All Locations</option>
              <option>Central Business District</option>
              <option>Thapong Café & Deli</option>
              <option>Masa Square</option>
              <option>Gaborone Club</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Search</label>
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        <section className="section-head">
          <div>
            <h2>Upcoming Events</h2>
            <p>{filteredEvents.length} event(s) found</p>
          </div>

          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === "grid" ? "active" : ""}`}
              onClick={() => setViewMode("grid")}
            >
              Grid
            </button>
            <button
              className={`toggle-btn ${viewMode === "list" ? "active" : ""}`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </section>

        {filteredEvents.length > 0 ? (
          <div className={viewMode === "list" ? "list-view-wrapper" : ""}>
            <EventGrid events={filteredEvents} onEventAction={handleEventAction} />
          </div>
        ) : (
          <div className="empty-state">
            <h3>No events found</h3>
            <p>Try changing your search text or filters.</p>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}