import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import EventGrid from "../../components/events/EventGrid";
import StatCard from "../../components/ui/StatCard";
import { organiserEvents } from "../../data/mockEvents";
import type { EventItem } from "../../types";
import { Link } from "react-router-dom";

<Link
  to="/create-event"
  className="mt-5 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
>
  Create Event
</Link>

const QUICK_ACTIONS = [
  {
    title: "Create Event",
    desc: "Start a new event listing with dates, venue, and ticket details.",
    href: "/create-event",
  },
  {
    title: "Manage Attendees",
    desc: "Review registrations and monitor attendance activity.",
    href: "/attendees",
  },
  {
    title: "View Analytics",
    desc: "Check performance, engagement, and event reach.",
    href: "/analytics",
  },
];

export default function OrganiserHome() {
  const navigate = useNavigate();
  const handleEventAction = (event: EventItem) => navigate(`/manage-event/${event.id}`);

  return (
    <DashboardLayout
      title="Welcome Back, Organiser"
      subtitle="Manage your events, track engagement, and create new experiences from one place."
      showSponsor
    >
      {/* Full width banner */}
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

      {/* Stat cards row */}
      <section className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard value="08" label="Active Events" note="2 more than last month" />
        <StatCard value="1,248" label="Total Attendees" note="Across all current events" />
        <StatCard value="87%" label="Engagement Rate" note="Strong attendee interaction" />
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
          <h2 className="text-lg font-bold text-gray-900">My Events</h2>
          <button
            type="button"
            onClick={() => navigate("/my-events")}
            className="text-sm font-medium text-indigo-600 transition-colors hover:text-indigo-800"
          >
            See all
          </button>
        </div>

        {organiserEvents.length > 0 ? (
          <EventGrid events={organiserEvents} onEventAction={handleEventAction} />
        ) : (
          <div className="py-16 text-center">
            <p className="text-base font-medium text-gray-600">No events created yet</p>
            <p className="mt-1 text-sm text-gray-400">Start by creating your first event.</p>
            <button
              type="button"
              onClick={() => navigate("/create-event")}
              className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
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
            {
              title: "Attendance Overview",
              desc: "Track how many people are registering and attending across your active events.",
            },
            {
              title: "Event Performance",
              desc: "See which events are gaining the most interest and where engagement is strongest.",
            },
            {
              title: "Management Tools",
              desc: "Access event creation, attendee tracking, and analytics from the same workspace.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-base font-semibold text-gray-900">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}