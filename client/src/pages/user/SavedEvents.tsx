import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Bookmark, BookmarkX } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import type { Event } from "../../types";

const API_BASE = "http://localhost:5001/api";

function getToken(): string {
  try {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored).token : "";
  } catch { return ""; }
}

export default function SavedEvents() {
  const navigate = useNavigate();

  const [events,  setEvents]  = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);
  const [search,  setSearch]  = useState("");
  const [unsaving, setUnsaving] = useState<string | null>(null);

  // Load saved events 
  const loadSaved = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/users/me/saved`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to load saved events");
      const data: Event[] = await res.json();
      setEvents(data);
    } catch {
      setError("Could not load saved events");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  // Unsave
  const handleUnsave = async (eventId: string) => {
    setUnsaving(eventId);
    try {
      const res = await fetch(`${API_BASE}/users/me/saved/${eventId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch {
      alert("Failed to unsave event");
    } finally {
      setUnsaving(null);
    }
  };

  // Filter 
  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    (e.category ?? "").toLowerCase().includes(search.toLowerCase()) ||
    (e.location ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Saved Events"
      subtitle="Events you've bookmarked and want to attend."
      showSponsor
    >
      {/* Search */}
      <section className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search saved events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="button"
            onClick={() => navigate("/browse-events")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <Bookmark size={15} />
            Browse More
          </button>
        </div>
      </section>

      {/* Count */}
      {!loading && !error && (
        <p className="mb-4 text-sm text-gray-400">
          {filtered.length} saved {filtered.length === 1 ? "event" : "events"}
        </p>
      )}

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
          <p className="text-sm font-medium text-red-600">{error}</p>
          <button onClick={loadSaved}
            className="mt-3 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Try Again
          </button>
        </div>
      )}

      {/* Events */}
      {!loading && !error && filtered.length > 0 && (
        <section className="space-y-4">
          {filtered.map((event) => {
            const thumbnailUrl = event.thumbnail
              ? `http://localhost:5001${event.thumbnail}`
              : null;
            const dateStr = event.date
              ? new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
              : "TBC";
            const price = typeof event.price === "number"
              ? event.price === 0 ? "Free" : `P${event.price}`
              : "Free";

            return (
              <div
                key={event._id}
                className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                {/* Image */}
                <div className="h-32 w-full sm:h-auto sm:w-36 flex-shrink-0 overflow-hidden">
                  {thumbnailUrl ? (
                    <img src={thumbnailUrl} alt={event.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full" style={{ background: event.imageBg ?? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }} />
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {event.category && (
                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                          {event.category}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{event.title}</h3>
                    {event.description && (
                      <p className="mt-1 text-xs text-gray-400 leading-relaxed line-clamp-2">{event.description}</p>
                    )}
                    <div className="mt-2 space-y-1">
                      <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Calendar size={12} /> {dateStr}
                      </p>
                      {event.location && (
                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                          <MapPin size={12} /> {event.location}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-sm font-bold text-gray-900">{price}</span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleUnsave(event._id)}
                        disabled={unsaving === event._id}
                        className="flex items-center gap-1.5 rounded-xl border border-red-100 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        <BookmarkX size={13} />
                        {unsaving === event._id ? "Removing..." : "Unsave"}
                      </button>
                      <button
                        type="button"
                        onClick={() => navigate(`/browse-events/${event._id}`)}
                        className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                      >
                        View Event
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-medium text-gray-600">No saved events</p>
          <p className="mt-1 text-sm text-gray-400">
            {search ? "Try a different search term." : "Browse events and save ones you're interested in."}
          </p>
          {!search && (
            <button
              type="button"
              onClick={() => navigate("/browse-events")}
              className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Browse Events
            </button>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}