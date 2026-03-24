import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/sidebar";
import Topbar from "../../components/layout/topbar";
import Footer from "../../components/layout/footer";
import EventGrid from "../../components/events/eventGrid";
import type { EventItem, SidebarLink, SidebarSection } from "../../types";
import "../../styles/pages/home.css";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();

  const sections: SidebarSection[] = [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "/home", active: true },
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
  ];

  const bottomLinks: SidebarLink[] = [
    { label: "Settings", href: "/settings" },
    { label: "Logout", href: "/logout" },
  ];

  const featuredEvents: EventItem[] = [
    {
      id: 1,
      category: "Technology",
      categoryClass: "tech",
      registered: "245 Registered",
      title: "Developer Meetup",
      description:
        "Connect with developers and explore current trends in software and innovation.",
      date: "March 28, 2026",
      time: "5:00 PM - 8:00 PM",
      location: "Innovation Hub",
      price: "Free",
      imageClass: "tech-image",
      buttonText: "View Event",
    },
    {
      id: 2,
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
      id: 3,
      category: "Music",
      categoryClass: "music",
      registered: "98 Registered",
      title: "Live Acoustic Session",
      description:
        "Enjoy an intimate evening of acoustic performances from talented local artists.",
      date: "March 26, 2026",
      time: "7:00 PM - 10:00 PM",
      location: "Gaborone Club",
      price: "P80",
      imageClass: "music-image",
      buttonText: "View Event",
    },
  ];

  const filteredFeaturedEvents = useMemo(() => {
    return featuredEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.description ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.location ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (event.category ?? "").toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || event.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [featuredEvents, searchTerm, selectedCategory]);

  const handleEventAction = (event: EventItem) => {
    navigate(`/events/${event.id}`);
  };

  const handleChipClick = (category: string) => {
    setSelectedCategory(category);
    navigate("/browse-events");
  };

  const handleSearch = () => {
    navigate("/browse-events");
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
          title="Discover Events Around You"
          subtitle="Find experiences, connect with people, and explore what’s happening."
          onMenuClick={() => setSidebarOpen(true)}
          showSponsor
        />

        <section className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search events, categories, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          <div className="filter-chips">
            <span onClick={() => handleChipClick("Technology")}>Technology</span>
            <span onClick={() => handleChipClick("Music")}>Music</span>
            <span onClick={() => handleChipClick("Business")}>Business</span>
            <span onClick={() => handleChipClick("Sports")}>Sports</span>
            <span onClick={() => handleChipClick("Community")}>Community</span>
          </div>
        </section>

        <section className="hero-grid">
          <div className="hero-card large-card">
            <p className="small-tag">Featured Event</p>
            <h2>Creative Tech Summit 2026</h2>
            <p>
              Join innovators, creators, and entrepreneurs for a full day of talks,
              networking, and inspiration.
            </p>
            <button onClick={() => navigate("/events/100")}>View Event</button>
          </div>

          <div className="hero-card small-card">
            <p className="small-tag">Trending</p>
            <h3>Startup Networking Night</h3>
            <p>March 24 • Botswana Innovation Hub</p>
          </div>

          <div className="hero-card small-card">
            <p className="small-tag">Popular</p>
            <h3>Live Acoustic Session</h3>
            <p>March 26 • Gaborone Club</p>
          </div>
        </section>

        <section className="content-section">
          <div className="section-head">
            <h2>Featured Events</h2>
            <button
              type="button"
              className="link-btn"
              onClick={() => navigate("/browse-events")}
            >
              See all
            </button>
          </div>

          {filteredFeaturedEvents.length > 0 ? (
            <EventGrid events={filteredFeaturedEvents} onEventAction={handleEventAction} />
          ) : (
            <div className="empty-state">
              <h3>No featured events found</h3>
              <p>Try a different search term or explore all events.</p>
            </div>
          )}
        </section>

        <Footer />
      </main>
    </div>
  );
}