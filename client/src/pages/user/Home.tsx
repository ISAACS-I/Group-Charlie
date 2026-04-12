import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EventGrid from "../../components/events/EventGrid";
import { featuredEvents } from "../../data/mockEvents";
import type { EventItem } from "../../types";

const CATEGORIES = [
  "All",
  "Technology",
  "Music",
  "Business",
  "Sports",
  "Community",
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const filteredEvents = useMemo(() => {
    const q = searchTerm.toLowerCase();

    return featuredEvents.filter((e) => {
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        (e.category ?? "").toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "All" || e.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleEventAction = (event: EventItem) => navigate(`/browse-events/${event.id}`);

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (selectedCategory !== "All") {
      params.set("category", selectedCategory);
    }

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    navigate(`/browse-events?${params.toString()}`);
  };

  const handleChipClick = (category: string) => {
    setSelectedCategory(category);

    const params = new URLSearchParams();

    if (category !== "All") {
      params.set("category", category);
    }

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    navigate(`/browse-events?${params.toString()}`);
  };

  return (
    <DashboardLayout
      title="Discover Events Around You"
      subtitle="Find experiences, connect with people, and explore what's happening."
      showSponsor
    >
      <section className="mb-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            type="text"
            placeholder="Search events, categories, or locations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <button
            type="button"
            onClick={handleSearch}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => handleChipClick(cat)}
              className={`rounded-full border px-4 py-1.5 text-sm transition-colors ${
                selectedCategory === cat
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="min-h-[200px] rounded-2xl bg-indigo-600 p-8 md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
            Featured Event
          </span>
          <h2 className="mt-2 text-2xl font-bold leading-snug text-white">
            Creative Tech Summit 2026
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-indigo-200">
            Join innovators, creators, and entrepreneurs for a full day of talks,
            networking, and inspiration.
          </p>
          <button
            type="button"
            onClick={() => navigate("/events/100")}
            className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
          >
            View Event
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div
            className="flex-1 cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
            onClick={() => navigate("/events/101")}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Trending
            </span>
            <h3 className="mt-1 text-base font-semibold text-gray-900">
              Startup Networking Night
            </h3>
            <p className="mt-1 text-xs text-gray-400">
              March 24 • Botswana Innovation Hub
            </p>
          </div>

          <div
            className="flex-1 cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
            onClick={() => navigate("/events/102")}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Popular
            </span>
            <h3 className="mt-1 text-base font-semibold text-gray-900">
              Live Acoustic Session
            </h3>
            <p className="mt-1 text-xs text-gray-400">March 26 • Gaborone Club</p>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Featured Events</h2>
          <button
            type="button"
            onClick={() => navigate("/browse-events")}
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
          >
            See all
          </button>
        </div>

        {filteredEvents.length > 0 ? (
          <EventGrid events={filteredEvents} onEventAction={handleEventAction} />
        ) : (
          <div className="py-16 text-center text-gray-400">
            <p className="text-base font-medium text-gray-600">No events found</p>
            <p className="mt-1 text-sm">
              Try a different search term or explore all events.
            </p>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-5 text-lg font-bold text-gray-900">Why Join?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              title: "Easy Discovery",
              desc: "Find relevant events quickly using smart search, clear categories, and featured recommendations.",
            },
            {
              title: "Quick Booking",
              desc: "Reserve your place through a simple booking flow that feels fast, clear, and easy to understand.",
            },
            {
              title: "Organiser Access",
              desc: "Approved users can unlock organiser privileges and manage events, attendees, and insights in one place.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-base font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}