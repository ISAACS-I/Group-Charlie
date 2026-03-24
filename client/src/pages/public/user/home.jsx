import { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import Topbar from "../../components/layout/Topbar";
import Footer from "../../components/layout/Footer";
import EventGrid from "../../components/events/EventGrid";
import "../../styles/pages/home.css";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarSections = [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "#", active: true },
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
  ];

  const bottomLinks = [
    { label: "Settings", href: "#" },
    { label: "Logout", href: "#" },
  ];

  const featuredEvents = [
    {
      id: 1,
      category: "Technology",
      categoryClass: "tech",
      registered: "245 Registered",
      title: "Developer Meetup",
      description: "Connect with developers and explore current trends in software and innovation.",
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
      description: "Network with founders, professionals, and aspiring leaders across industries.",
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
      registered: "312 Registered",
      title: "Live Music Night",
      description: "Enjoy local artists, live sets, and a vibrant evening experience.",
      date: "March 30, 2026",
      time: "7:00 PM - 11:00 PM",
      location: "Gaborone Club",
      price: "P80",
      imageClass: "music-image",
      buttonText: "View Event",
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
          title="Discover Events Around You"
          subtitle="Find experiences, connect with people, and explore what’s happening."
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

        <section className="hero-grid">
          <div className="hero-card large-card">
            <p className="small-tag">Featured Event</p>
            <h2>Creative Tech Summit 2026</h2>
            <p>
              Join innovators, creators, and entrepreneurs for a full day of talks,
              networking, and inspiration.
            </p>
            <button>View Event</button>
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
            <a href="#">See all</a>
          </div>

          <EventGrid events={featuredEvents} />
        </section>

        <section className="why-join-section">
          <div className="section-head">
            <h2>Why Join?</h2>
          </div>

          <div className="why-join-grid">
            <div className="why-card">
              <h3>Easy Discovery</h3>
              <p>
                Find relevant events quickly using search, categories, and featured recommendations.
              </p>
            </div>

            <div className="why-card">
              <h3>Quick Booking</h3>
              <p>
                Reserve your place through a simple booking flow that feels fast and clear.
              </p>
            </div>

            <div className="why-card">
              <h3>QR Access</h3>
              <p>
                Get a unique QR code after booking for fast entry and easier event access.
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}