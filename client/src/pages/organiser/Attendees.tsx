import { useMemo, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

// ===================== TYPES =====================

// These are the only allowed attendance states.
// Using a union type prevents invalid status values.
type AttendeeStatus = "Checked In" | "Not Checked In";

// This describes one attendee record.
// Every attendee object passed into this page must follow this structure.
interface AttendeeItem {
  id: number; // unique identifier used by React for rendering lists
  name: string; // attendee full name
  email: string; // attendee email address
  event: string; // event the attendee registered for
  status: AttendeeStatus; // attendee check-in state
  ticket: string; // ticket type such as VIP, General, or Online
}

// This describes one recent activity item.
// It is displayed in the Recent Activity panel.
interface RecentActivityItem {
  id: number; // unique identifier for list rendering
  name: string; // person related to the activity
  action: string; // what happened
  event: string; // event connected to the action
}

// ===================== MOCK DATA =====================

// This is temporary sample data for the UI.
// Later, this can be replaced by data from an API or database.
const attendeesData: AttendeeItem[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    event: "Tech Summit 2024",
    status: "Checked In",
    ticket: "VIP",
  },
  {
    id: 2,
    name: "David Moyo",
    email: "david@example.com",
    event: "UX Design Masterclass",
    status: "Not Checked In",
    ticket: "General",
  },
  {
    id: 3,
    name: "Amara Ncube",
    email: "amara@example.com",
    event: "Startup Networking Night",
    status: "Checked In",
    ticket: "General",
  },
  {
    id: 4,
    name: "Leo Banda",
    email: "leo@example.com",
    event: "Digital Marketing Trends",
    status: "Not Checked In",
    ticket: "Online",
  },
  {
    id: 5,
    name: "Mary Chuma",
    email: "mary@example.com",
    event: "Tech Summit 2024",
    status: "Checked In",
    ticket: "VIP",
  },
  {
    id: 6,
    name: "Brian Tau",
    email: "brian@example.com",
    event: "Startup Networking Night",
    status: "Not Checked In",
    ticket: "General",
  },
];

const recentActivityData: RecentActivityItem[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    action: "Checked in for",
    event: "Tech Summit 2024",
  },
  {
    id: 2,
    name: "David Moyo",
    action: "Registered for",
    event: "UX Design Masterclass",
  },
  {
    id: 3,
    name: "Leo Banda",
    action: "Registered for",
    event: "Digital Marketing Trends",
  },
];

// ===================== SMALL UI HELPERS =====================

// This helper component displays a colored status badge.
// It changes color depending on whether the attendee has checked in or not.
function StatusBadge({ status }: { status: AttendeeStatus }) {
  const styles =
    status === "Checked In"
      ? "bg-green-100 text-green-700"
      : "bg-indigo-100 text-indigo-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}
    >
      {status}
    </span>
  );
}

// This is a reusable statistic card.
// It is used for the top summary boxes like Total Attendees.
function StatsCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className="mt-1 text-sm text-gray-400">{label}</p>
    </div>
  );
}

// This is a reusable button for the right-side quick actions panel.
function ActionButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
    >
      {label}
    </button>
  );
}

// ===================== PAGE COMPONENT =====================

export default function AttendeesPage() {
  // This stores the search text typed by the organiser.
  const [searchTerm, setSearchTerm] = useState("");

  // This stores the currently selected event filter.
  // "All Events" means do not filter by event.
  const [selectedEvent, setSelectedEvent] = useState("All Events");

  // This stores the currently selected status filter.
  // "All Status" means do not filter by check-in status.
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // This creates a list of unique event names from the attendee data.
  // We use Set to remove duplicates.
  const eventOptions = useMemo(() => {
    const uniqueEvents = new Set(attendeesData.map((attendee) => attendee.event));
    return ["All Events", ...Array.from(uniqueEvents)];
  }, []);

  // This filters attendees based on:
  // 1. search by name or email
  // 2. selected event
  // 3. selected status
  const filteredAttendees = useMemo(() => {
    return attendeesData.filter((attendee) => {
      const matchesSearch =
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEvent =
        selectedEvent === "All Events" || attendee.event === selectedEvent;

      const matchesStatus =
        selectedStatus === "All Status" || attendee.status === selectedStatus;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [searchTerm, selectedEvent, selectedStatus]);

  // These summary values are calculated from the full attendee list.
  // They are shown in the top statistic cards.
  const totalAttendees = attendeesData.length;
  const checkedInCount = attendeesData.filter(
    (attendee) => attendee.status === "Checked In"
  ).length;
  const notCheckedInCount = attendeesData.filter(
    (attendee) => attendee.status === "Not Checked In"
  ).length;

  return (
    <DashboardLayout
      title="Attendees"
      subtitle="View, manage, and track everyone registered for your events."
      showSponsor
    >
      <div className="space-y-5">
        {/* ===================== TOP STATS ===================== */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatsCard value={totalAttendees} label="Total Attendees" />
          <StatsCard value={checkedInCount} label="Checked In" />
          <StatsCard value={notCheckedInCount} label="Not Checked In" />
        </section>

        {/* ===================== SEARCH BAR ===================== */}
        <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search attendee by name or email..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
            />

            {/* This button is mostly visual here because filtering happens instantly.
                But it matches the screenshot layout. */}
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </section>

        {/* ===================== FILTERS ===================== */}
        <section className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedEvent}
            onChange={(event) => setSelectedEvent(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-indigo-500"
          >
            {eventOptions.map((eventName) => (
              <option key={eventName} value={eventName}>
                {eventName}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(event) => setSelectedStatus(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-indigo-500"
          >
            <option value="All Status">All Status</option>
            <option value="Checked In">Checked In</option>
            <option value="Not Checked In">Not Checked In</option>
          </select>
        </section>

        {/* ===================== MAIN CONTENT ===================== */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_0.9fr]">
          {/* ===================== ATTENDEE TABLE ===================== */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900">Attendee List</h2>
              <p className="mt-1 text-sm text-gray-400">
                Keep track of attendance across your events.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                    <th className="rounded-l-xl bg-gray-50 px-4 py-3">Name</th>
                    <th className="bg-gray-50 px-4 py-3">Email</th>
                    <th className="bg-gray-50 px-4 py-3">Event</th>
                    <th className="bg-gray-50 px-4 py-3">Status</th>
                    <th className="rounded-r-xl bg-gray-50 px-4 py-3">Ticket</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAttendees.length > 0 ? (
                    filteredAttendees.map((attendee) => (
                      <tr key={attendee.id} className="text-sm text-gray-700">
                        <td className="border-b border-gray-100 px-4 py-3">
                          {attendee.name}
                        </td>
                        <td className="border-b border-gray-100 px-4 py-3 text-gray-500">
                          {attendee.email}
                        </td>
                        <td className="border-b border-gray-100 px-4 py-3">
                          {attendee.event}
                        </td>
                        <td className="border-b border-gray-100 px-4 py-3">
                          <StatusBadge status={attendee.status} />
                        </td>
                        <td className="border-b border-gray-100 px-4 py-3">
                          {attendee.ticket}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-10 text-center text-sm text-gray-400"
                      >
                        No attendees found for the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===================== RIGHT SIDEBAR ===================== */}
          <div className="space-y-5">
            {/* Quick Actions */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Quick Actions</h3>

              <div className="mt-4 space-y-3">
                <ActionButton label="Export Attendee List" />
                <ActionButton label="Send Reminder Email" />
                <ActionButton label="Download Attendee List" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>

              <div className="mt-4 space-y-3">
                {recentActivityData.map((activity) => (
                  <div
                    key={activity.id}
                    className="rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <p className="text-sm font-semibold text-gray-900">
                      {activity.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {activity.action} {activity.event}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Tips</h3>

              <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-gray-500">
                <li>Check in attendees as they arrive.</li>
                <li>Keep attendee email addresses accurate.</li>
                <li>Export the list before large events.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}