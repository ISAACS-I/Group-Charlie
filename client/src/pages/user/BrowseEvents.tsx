import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  "Arts & Culture",
  "Food & Drink",
];

const DATES = ["All Dates", "This Week", "This Month", "Next Month"];
const LOCATIONS = ["All Locations", "Gaborone", "Francistown", "Maun", "Serowe"];

type ViewMode = "grid" | "list";

  const allEvents: EventItem[] = [
    ...featuredEvents,
    {
      id: "4",
      category: "Arts & Culture",
      registered: "89 Registered",
      title: "Contemporary Art Exhibition",
      description:
        "Experience the finest contemporary art from emerging and established local artists.",
      date: "March 28, 2026",
      time: "2:00 PM - 8:00 PM",
      location: "Thapong Cafe & Deli",
      imageBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      buttonText: "Register Now",
    },
    {
      id: "5",
      category: "Sports",
      registered: "432 Registered",
      title: "FNB Kazungula Bridge Marathon 2026",
      description:
        "Join thousands of runners in the annual city marathon for health and community.",
      date: "April 10, 2026",
      time: "6:00 AM - 12:00 PM",
      location: "Kazungula Bridge",
      tag: "Popular",
      imageBg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      buttonText: "Register Now",
    },
    {
      id: "6",
      category: "Music",
      registered: "678 Registered",
      title: "Lekompo Summer Music Festival",
      description:
        "Three days of incredible live performances from top lekompo artists.",
      date: "November 15-17, 2026",
      time: "12:00 PM - 11:00 PM",
      location: "Serowe",
      imageBg: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
      buttonText: "Register Now",
    },
    {
      id: "7",
      category: "Food & Drink",
      registered: "34 Registered",
      title: "Gourmet Cooking Workshop",
      description:
        "Learn professional cooking techniques from Chef Seeletso in hands-on sessions.",
      date: "July 5, 2026",
      time: "3:00 PM - 7:00 PM",
      location: "Cresta Hotel and Restaurant",
      imageBg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      buttonText: "Register Now",
    },
  ];

function matchesDateFilter(eventDate: string | undefined, filter: string) {
  if (!eventDate || filter === "All Dates") return true;

  const lower = eventDate.toLowerCase();

  if (filter === "This Week") {
    return lower.includes("march 25, 2026") || lower.includes("march 28, 2026");
  }

  if (filter === "This Month") {
    return lower.includes("march");
  }

  if (filter === "Next Month") {
    return lower.includes("april");
  }

  return true;
}

export default function BrowseEvents() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "All Categories");
  const [date, setDate] = useState(searchParams.get("date") ?? "All Dates");
  const [location, setLocation] = useState(searchParams.get("location") ?? "All Locations");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");



  useEffect(() => {
    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (category !== "All Categories") params.set("category", category);
    if (date !== "All Dates") params.set("date", date);
    if (location !== "All Locations") params.set("location", location);

    setSearchParams(params, { replace: true });
  }, [search, category, date, location, setSearchParams]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();

    return allEvents.filter((e) => {
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q) ||
        (e.location ?? "").toLowerCase().includes(q) ||
        (e.category ?? "").toLowerCase().includes(q);

      const matchesCategory =
        category === "All Categories" || e.category === category;

      const matchesLocation =
        location === "All Locations" ||
        (e.location ?? "").toLowerCase().includes(location.toLowerCase());

      const matchesDate = matchesDateFilter(e.date, date);

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
  }, [search, category, date, location]);

  const handleEventAction = (event: EventItem) => navigate(`/events/${event.id}`);

  return (
    <DashboardLayout
      title="Browse Events"
      subtitle="Discover and register for upcoming events using your unique QR-based registration."
      showSponsor
    >
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white">Discover Amazing Events</h2>
          <p className="mt-1 text-sm text-indigo-100">
            Register once, attend multiple events with your unique QR code.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {[
              { label: "Quick Check-in", sub: "Scan & Go" },
              { label: "Secure Registration", sub: "One-time Setup" },
            ].map((badge) => (
              <div key={badge.label} className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm">
                <p className="text-xs text-indigo-100">{badge.label}</p>
                <p className="text-sm font-semibold text-white">{badge.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/10" />
      </section>

      <section className="mb-8 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Date</label>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {DATES.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Location</label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-gray-500">Search</label>
            <input
              type="text"
              placeholder="Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      </section>

      <section>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Upcoming Events
            <span className="ml-2 text-sm font-normal text-gray-400">({filtered.length})</span>
          </h2>

          <div className="flex items-center gap-1 rounded-xl bg-gray-100 p-1">
            {(["grid", "list"] as ViewMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                  viewMode === mode
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          viewMode === "grid" ? (
            <EventGrid events={filtered} onEventAction={handleEventAction} />
          ) : (
            <div className="space-y-3">
              {filtered.map((event) => (
                <div
                  key={event.id}
                  className="flex cursor-pointer items-center gap-5 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  onClick={() => handleEventAction(event)}
                >
                  <div
                    className="h-16 w-16 flex-shrink-0 rounded-xl"
                    style={{
                      background:
                        event.imageBg ?? "linear-gradient(135deg,#e0e7ff,#c7d2fe)",
                    }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      {event.category && (
                        <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                          {event.category}
                        </span>
                      )}
                      {event.registered && (
                        <span className="text-xs text-gray-400">• {event.registered}</span>
                      )}
                    </div>
                    <h3 className="truncate text-base font-semibold text-gray-900">
                      {event.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {event.date}
                      {event.location ? ` • ${event.location}` : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEventAction(event);
                    }}
                    className="flex-shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                  >
                    {event.buttonText ?? "Register Now"}
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="py-20 text-center">
            <p className="text-base font-medium text-gray-600">No events found</p>
            <p className="mt-1 text-sm text-gray-400">
              Try adjusting your filters or search term.
            </p>
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}