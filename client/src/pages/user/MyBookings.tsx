import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, QrCode } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const API_BASE = "http://localhost:5001/api";

function getToken(): string {
  try {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored).token : "";
  } catch { return ""; }
}

type BookingStatus = "Upcoming" | "Past" | "Cancelled";

interface BookingItem {
  id: string;
  eventId: string;
  eventTitle: string;
  category: string;
  date: string;
  time: string;
  location: string;
  status: BookingStatus;
  imageBg: string;
  price: string;
}

function getBookingStatus(eventDate: string | undefined, bookingStatus: string): BookingStatus {
  if (bookingStatus === "cancelled") return "Cancelled";
  if (!eventDate) return "Upcoming";
  return new Date(eventDate) < new Date() ? "Past" : "Upcoming";
}

const statusStyles: Record<BookingStatus, string> = {
  Upcoming:  "bg-emerald-50 text-emerald-700",
  Past:      "bg-gray-100 text-gray-500",
  Cancelled: "bg-red-50 text-red-600",
};

const tabs: BookingStatus[] = ["Upcoming", "Past", "Cancelled"];

export default function MyBookings() {
  const navigate = useNavigate();
  const [bookings,    setBookings]    = useState<BookingItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);
  const [activeTab,   setActiveTab]   = useState<BookingStatus>("Upcoming");
  const [cancelling,  setCancelling]  = useState<string | null>(null);

  const loadBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/bookings/my`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to load bookings");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = await res.json();

      const mapped: BookingItem[] = data.map(b => {
        const event = b.event ?? {};
        const status = getBookingStatus(event.date, b.status);
        return {
          id:         b._id,
          eventId:    event._id ?? "",
          eventTitle: event.title ?? "Unknown Event",
          category:   event.category ?? "",
          date:       event.date
            ? new Date(event.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
            : "TBC",
          time:       event.time ?? "",
          location:   event.location ?? "",
          status,
          imageBg:    event.imageBg ?? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          price:      typeof event.price === "number"
            ? event.price === 0 ? "Free" : `P${event.price}`
            : "Free",
        };
      });

      setBookings(mapped);
    } catch {
      setError("Could not load your bookings");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  const handleCancel = async (bookingId: string) => {
    if (!confirm("Cancel this booking? This cannot be undone.")) return;
    setCancelling(bookingId);
    try {
      const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status: "Cancelled" } : b
      ));
    } catch {
      alert("Failed to cancel booking");
    } finally {
      setCancelling(null);
    }
  };

  const tabCounts = {
    Upcoming:  bookings.filter(b => b.status === "Upcoming").length,
    Past:      bookings.filter(b => b.status === "Past").length,
    Cancelled: bookings.filter(b => b.status === "Cancelled").length,
  };

  const filtered = bookings.filter(b => b.status === activeTab);

  return (
    <DashboardLayout
      title="My Bookings"
      subtitle="View and manage all your event registrations."
      showSponsor
    >
      {/* Tabs */}
      <section className="mb-5 flex flex-wrap gap-3">
        {tabs.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {tab} ({loading ? "..." : tabCounts[tab]})
          </button>
        ))}
      </section>

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
          <button onClick={loadBookings}
            className="mt-3 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700">
            Try Again
          </button>
        </div>
      )}

      {/* Bookings */}
      {!loading && !error && filtered.length > 0 && (
        <section className="space-y-4">
          {filtered.map(booking => (
            <div
              key={booking.id}
              className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div
                className="h-32 w-full sm:h-auto sm:w-36 flex-shrink-0"
                style={{ background: booking.imageBg }}
              />

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {booking.category && (
                      <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                        {booking.category}
                      </span>
                    )}
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-gray-900">{booking.eventTitle}</h3>

                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={12} /> {booking.date}
                    </p>
                    {booking.time && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <Clock size={12} /> {booking.time}
                      </p>
                    )}
                    {booking.location && (
                      <p className="flex items-center gap-1.5 text-xs text-gray-400">
                        <MapPin size={12} /> {booking.location}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-900">{booking.price}</span>
                  <div className="flex gap-2">
                    {booking.status === "Upcoming" && (
                      <>
                        <button
                          type="button"
                          onClick={() => navigate("/settings")}
                          className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100"
                        >
                          <QrCode size={13} />
                          View QR Pass
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCancel(booking.id)}
                          disabled={cancelling === booking.id}
                          className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
                        >
                          {cancelling === booking.id ? "Cancelling..." : "Cancel"}
                        </button>
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => navigate(`/browse-events/${booking.eventId}`)}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                    >
                      View Event
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Empty */}
      {!loading && !error && filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
          <p className="text-base font-medium text-gray-600">No {activeTab.toLowerCase()} bookings</p>
          <p className="mt-1 text-sm text-gray-400">
            {activeTab === "Upcoming"
              ? "Browse events and register to see your bookings here."
              : `You have no ${activeTab.toLowerCase()} bookings.`}
          </p>
          {activeTab === "Upcoming" && (
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