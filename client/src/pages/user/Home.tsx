import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EventGrid from "../../components/events/EventGrid";
import { fetchEvents } from "../../utils/eventApi";
import type { Event, EventItem } from "../../types";

const CATEGORIES = ["All", "Technology", "Music", "Business", "Sports", "Community"];

// Map DB Event → EventItem shape the EventGrid expects
function toEventItem(e: Event): EventItem {
  return {
    id:          e._id,
    title:       e.title,
    description: e.description ?? "",
    category:    e.category    ?? "",
    location:    e.location    ?? "",
    date:        e.date
                   ? new Date(e.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
                   : "",
    time:        e.time    ?? "",
    imageBg:     e.imageBg ?? "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
    thumbnail:   (e as any).thumbnail ?? undefined,
    registered:  "",
    buttonText:  "Register Now",
  };
}

export default function Home() {
  const navigate = useNavigate();

  const [allEvents,        setAllEvents]        = useState<EventItem[]>([]);
  const [featuredEvent,    setFeaturedEvent]     = useState<EventItem | null>(null);
  const [trendingEvents,   setTrendingEvents]    = useState<EventItem[]>([]);
  const [loading,          setLoading]           = useState(true);
  const [searchTerm,       setSearchTerm]        = useState("");
  const [selectedCategory, setSelectedCategory]  = useState("All");

  // ─── Fetch events ────────────────────────────────────────────────────────────
  const loadEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEvents();
      const items = data.map(toEventItem);
      setAllEvents(items);

      // First Active event becomes the featured banner
      const active = data.find(e => e.status === "Active");
      if (active) setFeaturedEvent(toEventItem(active));

      // Next 2 Upcoming events become the trending sidebar cards
      const upcoming = data
        .filter(e => e.status === "Upcoming")
        .slice(0, 2)
        .map(toEventItem);
      setTrendingEvents(upcoming);
    } catch {
      // silently fail — grid will just be empty
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  // ─── Client-side filtering for the featured grid ─────────────────────────────
  const filteredEvents = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return allEvents.filter((e) => {
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q) ||
        (e.location    ?? "").toLowerCase().includes(q) ||
        (e.category    ?? "").toLowerCase().includes(q);

      const matchesCategory =
        selectedCategory === "All" || e.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [allEvents, searchTerm, selectedCategory]);

  const handleEventAction = (event: EventItem) =>
    navigate(`/browse-events/${event.id}`);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory !== "All") params.set("category", selectedCategory);
    if (searchTerm.trim())          params.set("search",   searchTerm.trim());
    navigate(`/browse-events?${params.toString()}`);
  };

  const handleChipClick = (category: string) => {
    setSelectedCategory(category);
    const params = new URLSearchParams();
    if (category !== "All")    params.set("category", category);
    if (searchTerm.trim())     params.set("search",   searchTerm.trim());
    navigate(`/browse-events?${params.toString()}`);
  };

  return (
    <DashboardLayout
      title="Discover Events Around You"
      subtitle="Find experiences, connect with people, and explore what's happening."
      showSponsor
    >
      {/* Search bar */}
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
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
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

      {/* Featured + Trending */}
      <section className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Featured banner */}
        {loading ? (
          <div className="md:col-span-2 min-h-[200px] rounded-2xl bg-gray-100 animate-pulse" />
        ) : featuredEvent ? (
          <div
            className="md:col-span-2 min-h-[200px] rounded-2xl p-8 cursor-pointer"
            style={{ background: featuredEvent.imageBg }}
            onClick={() => handleEventAction(featuredEvent)}
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-white/80">
              Featured Event
            </span>
            <h2 className="mt-2 text-2xl font-bold leading-snug text-white">
              {featuredEvent.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/80 line-clamp-2">
              {featuredEvent.description}
            </p>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleEventAction(featuredEvent); }}
              className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
            >
              View Event
            </button>
          </div>
        ) : (
          <div className="md:col-span-2 min-h-[200px] rounded-2xl bg-indigo-600 p-8 flex items-center justify-center">
            <p className="text-white/60 text-sm">No featured events right now</p>
          </div>
        )}

        {/* Trending sidebar */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <>
              <div className="flex-1 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="flex-1 rounded-2xl bg-gray-100 animate-pulse" />
            </>
          ) : trendingEvents.length > 0 ? (
            trendingEvents.map((event) => (
              <div
                key={event.id}
                className="flex-1 cursor-pointer rounded-2xl border border-gray-100 bg-white p-5 transition-shadow hover:shadow-md"
                onClick={() => handleEventAction(event)}
              >
                <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Upcoming
                </span>
                <h3 className="mt-1 text-base font-semibold text-gray-900 line-clamp-1">
                  {event.title}
                </h3>
                <p className="mt-1 text-xs text-gray-400">
                  {event.date}{event.location ? ` • ${event.location}` : ""}
                </p>
              </div>
            ))
          ) : (
            <div className="flex-1 rounded-2xl border border-gray-100 bg-white p-5 flex items-center justify-center">
              <p className="text-gray-400 text-sm">No upcoming events</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Events grid */}
      <section className="mb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Featured Events
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({loading ? "..." : filteredEvents.length})
            </span>
          </h2>
          <button
            type="button"
            onClick={() => navigate("/browse-events")}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            See all
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <EventGrid events={filteredEvents} onEventAction={handleEventAction} />
        ) : (
          <div className="py-16 text-center text-gray-400">
            <p className="text-base font-medium text-gray-600">No events found</p>
            <p className="mt-1 text-sm">Try a different search term or explore all events.</p>
          </div>
        )}
      </section>

      {/* Why Join */}
      <section>
        <h2 className="mb-5 text-lg font-bold text-gray-900">Why Join?</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Easy Discovery",    desc: "Find relevant events quickly using smart search, clear categories, and featured recommendations." },
            { title: "Quick Booking",     desc: "Reserve your place through a simple booking flow that feels fast, clear, and easy to understand." },
            { title: "Organiser Access",  desc: "Approved users can unlock organiser privileges and manage events, attendees, and insights in one place." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-2 text-base font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}