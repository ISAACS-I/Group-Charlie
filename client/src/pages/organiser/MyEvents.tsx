import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import type { Event } from "../../types";

const API_BASE = "http://localhost:5001/api";

function getToken(): string {
  try {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored).token : "";
  } catch { return ""; }
}

type TabStatus = "Upcoming" | "Past Events" | "Drafts" | "Cancelled";

// Map DB status → tab
function getTab(status: string | undefined, date: string | undefined): TabStatus {
  if (status === "Draft")    return "Drafts";
  if (status === "Active" || status === "Upcoming") {
    const isPast = date ? new Date(date) < new Date() : false;
    return isPast ? "Past Events" : "Upcoming";
  }
  return "Cancelled";
}

function StatusTab({ label, count, active, onClick }: {
  label: string; count: number; active: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      }`}
    >
      {label} ({count})
    </button>
  );
}

function MyEventCard({
  event,
  onManage,
  onDelete,
}: {
  event: Event;
  onManage: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/events/${event._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (res.ok) onDelete(event._id);
    } catch {
      alert("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  const dateStr = event.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      })
    : "No date set";

  const thumbnailUrl = (event as any).thumbnail
    ? `http://localhost:5001${(event as any).thumbnail}`
    : null;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="h-36 w-full overflow-hidden">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div 
            className="w-full h-full"
            style={{ background: event.imageBg ?? "linear-gradient(135deg, #c7d2fe, #ddd6fe)" }}
          />
        )}
      </div>
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-400">{event.category}</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
            event.status === "Active"   ? "bg-emerald-50 text-emerald-600" :
            event.status === "Upcoming" ? "bg-indigo-50 text-indigo-600"  :
            event.status === "Draft"    ? "bg-yellow-50 text-yellow-600"  :
                                          "bg-gray-100 text-gray-500"
          }`}>
            {event.status}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-tight text-gray-900">{event.title}</h3>
        <p className="mt-1 text-sm text-gray-400">{dateStr}{event.time ? ` • ${event.time}` : ""}</p>
        <p className="mt-0.5 text-sm text-gray-400">{event.location || "No location set"}</p>
        <p className="mt-0.5 text-xs text-gray-400">{event.capacity ? `${event.capacity} capacity` : ""}</p>

        <div className="mt-4 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onManage(event._id)}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Manage
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            {deleting ? "..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MyEventsPage() {
  const navigate = useNavigate();

  const [events,          setEvents]          = useState<Event[]>([]);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState<string | null>(null);
  const [activeTab,       setActiveTab]       = useState<TabStatus>("Upcoming");
  const [searchTerm,      setSearchTerm]      = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortOption,      setSortOption]      = useState("Sort by Date");

  // ─── Fetch organiser's events ─────────────────────────────────────────────
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/events/my`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to load events");
      const data: Event[] = await res.json();
      setEvents(data);
    } catch {
      setError("Could not load your events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  // Remove deleted event from state without refetching
  const handleDelete = (id: string) =>
    setEvents(prev => prev.filter(e => e._id !== id));

  // ─── Tab counts ───────────────────────────────────────────────────────────
  const tabCounts = useMemo(() => ({
    "Upcoming":    events.filter(e => getTab(e.status, String(e.date)) === "Upcoming").length,
    "Past Events": events.filter(e => getTab(e.status, String(e.date)) === "Past Events").length,
    "Drafts":      events.filter(e => getTab(e.status, String(e.date)) === "Drafts").length,
    "Cancelled":   events.filter(e => getTab(e.status, String(e.date)) === "Cancelled").length,
  }), [events]);

  // ─── Category options from real data ─────────────────────────────────────
  const categoryOptions = useMemo(() => {
    const unique = new Set(events.map(e => e.category).filter(Boolean));
    return ["All Categories", ...Array.from(unique)] as string[];
  }, [events]);

  // ─── Filtered + sorted events ─────────────────────────────────────────────
  const filteredEvents = useMemo(() => {
    let result = events.filter(e => {
      const tab = getTab(e.status, String(e.date));
      const matchesTab      = tab === activeTab;
      const matchesSearch   = !searchTerm ||
        e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.category ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (e.location ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || e.category === selectedCategory;
      return matchesTab && matchesSearch && matchesCategory;
    });

    if (sortOption === "Sort by Attendance") {
      result = [...result].sort((a, b) => (b.capacity ?? 0) - (a.capacity ?? 0));
    } else {
      result = [...result].sort((a, b) =>
        new Date(String(b.date)).getTime() - new Date(String(a.date)).getTime()
      );
    }

    return result;
  }, [events, activeTab, searchTerm, selectedCategory, sortOption]);

  return (
    <DashboardLayout
      title="My Events"
      subtitle="Manage, monitor, and update all your created events in one place."
      showSponsor
    >
      <div className="space-y-5">

        {/* Tabs */}
        <section className="flex flex-wrap gap-3">
          {(["Upcoming", "Past Events", "Drafts", "Cancelled"] as TabStatus[]).map(tab => (
            <StatusTab
              key={tab}
              label={tab}
              count={tabCounts[tab]}
              active={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </section>

        {/* Search */}
        <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </section>

        {/* Filters */}
        <section className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-indigo-500"
          >
            {categoryOptions.map(c => <option key={c}>{c}</option>)}
          </select>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-indigo-500"
          >
            <option>Sort by Date</option>
            <option>Sort by Attendance</option>
          </select>
        </section>

        {/* Grid */}
        <section>
          {loading && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-64 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
              <p className="text-sm font-medium text-red-600">{error}</p>
              <button
                onClick={loadEvents}
                className="mt-3 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredEvents.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {filteredEvents.map(event => (
                <MyEventCard
                  key={event._id}
                  event={event}
                  onManage={(id) => navigate(`/my-events/${id}`)}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {!loading && !error && filteredEvents.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
              <h3 className="text-xl font-semibold text-gray-900">No events found</h3>
              <p className="mt-2 text-sm text-gray-400">
                {events.length === 0
                  ? "You haven't created any events yet."
                  : "Try changing the tab, search term, or filters."}
              </p>
              {events.length === 0 && (
                <button
                  onClick={() => navigate("/create-event")}
                  className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Create your first event
                </button>
              )}
            </div>
          )}
        </section>

      </div>
    </DashboardLayout>
  );
}