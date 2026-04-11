import type { ReactNode } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

type EventStatus = "Upcoming" | "Past" | "Draft" | "Cancelled";

interface EventItem {
  id: number;
  category: string;
  title: string;
  dateTime: string;
  location: string;
  attendees: number;
  status: EventStatus;
}



// Mock event data.
// These also act as UI test cases because they cover multiple statuses.
const events: EventItem[] = [
  {
    id: 1,
    category: "Conference",
    title: "Tech Summit 2024",
    dateTime: "Mar 25, 2024 • 9:00 AM",
    location: "Botswanan Convention Center",
    attendees: 245,
    status: "Upcoming",
  },
  {
    id: 2,
    category: "Workshop",
    title: "UX Design Masterclass",
    dateTime: "Apr 2, 2024 • 2:00 PM",
    location: "Creative Hub Downtown",
    attendees: 48,
    status: "Draft",
  },
  {
    id: 3,
    category: "Meetup",
    title: "Startup Networking Night",
    dateTime: "Apr 10, 2024 • 6:30 PM",
    location: "The Innovation Lab",
    attendees: 87,
    status: "Upcoming",
  },
  {
    id: 4,
    category: "Webinar",
    title: "Digital Marketing Trends",
    dateTime: "Apr 18, 2024 • 11:00 AM",
    location: "Online Event",
    attendees: 312,
    status: "Past",
  },
];

function getStatusBadgeClasses(status: EventStatus) {
  switch (status) {
    case "Upcoming":
      return "bg-blue-100 text-blue-700";
    case "Past":
      return "bg-gray-100 text-gray-600";
    case "Draft":
      return "bg-amber-100 text-amber-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

// This component represents the "My Events" page.
// It displays created events with status tabs, search controls, and card actions.
export default function MyEventsPage() {
  return (
    <DashboardLayout
      title="My Events"
      subtitle="Manage, monitor, and update all your created events in one place."
      showSponsor
    >
      {/* Top controls section */}
      <div className="space-y-4">
        {/* Status filter tabs */}
        <div className="flex flex-wrap gap-3">
          {["Upcoming (4)", "Past Events (12)", "Drafts (2)", "Cancelled (1)"].map(
            (tab, i) => (
              <button
                key={tab}
                type="button"
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  i === 0
                    ? "bg-indigo-600 text-white"
                    : "bg-white text-gray-600 shadow-sm ring-1 ring-gray-100 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            )
          )}
        </div>

        {/* Search bar and button */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="Search events..."
            className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="button"
            className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Search
          </button>
        </div>

        {/* Extra filters */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="rounded-xl bg-white px-4 py-2 text-sm text-gray-600 shadow-sm ring-1 ring-gray-100"
          >
            All Categories
          </button>
          <button
            type="button"
            className="rounded-xl bg-white px-4 py-2 text-sm text-gray-600 shadow-sm ring-1 ring-gray-100"
          >
            Sort by Date
          </button>
        </div>
      </div>

      {/* Events grid */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Event image / banner placeholder */}
            <div className="relative h-32 bg-indigo-200">
              {/* Status badge */}
              <span
                className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClasses(
                  event.status
                )}`}
              >
                {event.status}
              </span>

              {/* Edit and delete actions */}
              <div className="absolute right-3 top-3 flex gap-2">
                <button
                  type="button"
                  aria-label={`Edit ${event.title}`}
                  className="rounded-lg bg-white/85 p-1.5 text-xs shadow-sm transition hover:bg-white"
                >
                  ✏️
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${event.title}`}
                  className="rounded-lg bg-white/85 p-1.5 text-xs shadow-sm transition hover:bg-white"
                >
                  🗑️
                </button>
              </div>
            </div>

            {/* Event content */}
            <div className="space-y-2 p-4">
              <span className="text-xs text-gray-400">{event.category}</span>

              <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>

              <p className="text-xs text-gray-400">{event.dateTime}</p>
              <p className="text-xs text-gray-400">{event.location}</p>

              <p className="text-xs font-medium text-gray-500">{event.attendees} attendees</p>

              <button
                type="button"
                className="mt-3 w-full rounded-lg bg-indigo-600 py-2 text-xs font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Manage Event
              </button>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
