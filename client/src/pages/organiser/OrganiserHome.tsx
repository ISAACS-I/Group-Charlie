import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EventGrid from "../../components/events/EventGrid";
import StatCard from "../../components/ui/StatCard";
import { useAuth } from "../../context/AuthContext";
import type { Event, EventItem } from "../../types";

const API_BASE = "http://localhost:5001/api";

function getToken(): string {
  try {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored).token : "";
  } catch { return ""; }
}

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
    registered:  "",
    buttonText:  "Manage",
  };
}

const QUICK_ACTIONS = [
  { title: "Create Event",      desc: "Start a new event listing with dates, venue, and ticket details.", href: "/create-event" },
  { title: "Manage Attendees",  desc: "Review registrations and monitor attendance activity.",            href: "/attendees"    },
  { title: "View Analytics",    desc: "Check performance, engagement, and event reach.",                  href: "/analytics"    },
];

export default function OrganiserHome() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [events,      setEvents]      = useState<EventItem[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [totalBookings, setTotalBookings] = useState(0);
  const [activeCount,   setActiveCount]   = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch only this organiser's events
      const res = await fetch(`${API_BASE}/events`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error();
      const data: Event[] = await res.json();

      // Filter to events created by this user
      const mine = data.filter(e =>
        e.organiser &&
        (typeof e.organiser === "string"
          ? e.organiser === user?._id
          : e.organiser._id === user?._id)
      );

      setEvents(mine.slice(0, 6).map(toEventItem)); // show latest 6 on home
      setActiveCount(mine.filter(e => e.status === "Active").length);

      // Fetch booking count for stats
      const bRes = await fetch(`${API_BASE}/bookings/my`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (bRes.ok) {
        const bookings = await bRes.json();
        setTotalBookings(bookings.length);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [user?._id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleEventAction = (event: EventItem) => navigate(`/my-events/${event.id}`);

  return (
    <DashboardLayout
      title="Welcome Back, Organiser"
      subtitle="Manage your events, track engagement, and create new experiences from one place."
      showSponsor
    >
      {/* Banner */}
      <section className="mb-6">
        <div className="rounded-2xl bg-indigo-600 p-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
            Quick Action
          </span>
          <h2 className="mt-2 text-2xl font-bold leading-snug text-white">
            Create and Manage Events Easily
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-indigo-200">
            Launch a new event, update existing ones, and keep track of attendee activity
            without leaving your dashboard.
          </p>
          <button
            type="button"
            onClick={() => navigate("/create-event")}
            className="mt-5 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-50"
          >
            Create Event
          </button>
        </div>
      </section>

      {/* Stat cards */}
      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          value={loading ? "..." : String(activeCount)}
          label="Active Events"
          note="Your currently active events"
        />
        <StatCard
          value={loading ? "..." : String(events.length)}
          label="Total Events"
          note="All events you've created"
        />
        <StatCard
          value={loading ? "..." : String(totalBookings)}
          label="Total Bookings"
          note="Across all your events"
        />
      </section>

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-bold text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.title}
              type="button"
              onClick={() => navigate(action.href)}
              className="rounded-2xl border border-gray-100 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="mb-1 text-base font-semibold text-gray-900">{action.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{action.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* My Events */}
      <section className="mb-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            My Events
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({loading ? "..." : events.length})
            </span>
          </h2>
          <button
            type="button"
            onClick={() => navigate("/my-events")}
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
        ) : events.length > 0 ? (
          <EventGrid events={events} onEventAction={handleEventAction} />
        ) : (
          <div className="py-16 text-center">
            <p className="text-base font-medium text-gray-600">No events created yet</p>
            <p className="mt-1 text-sm text-gray-400">Start by creating your first event.</p>
            <button
              type="button"
              onClick={() => navigate("/create-event")}
              className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
            >
              Create Event
            </button>
          </div>
        )}
      </section>

      {/* Organiser Insights */}
      <section>
        <h2 className="mb-4 text-lg font-bold text-gray-900">Organiser Insights</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { title: "Attendance Overview",  desc: "Track how many people are registering and attending across your active events."  },
            { title: "Event Performance",    desc: "See which events are gaining the most interest and where engagement is strongest." },
            { title: "Management Tools",     desc: "Access event creation, attendee tracking, and analytics from the same workspace."  },
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