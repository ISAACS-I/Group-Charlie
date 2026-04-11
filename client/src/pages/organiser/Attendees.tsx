import DashboardLayout from "../../components/layout/DashboardLayout";
import { useMemo, useState } from "react";

// ===================== TYPES =====================

// These are the only allowed attendance states.
// Using a union type prevents invalid status values.
type AttendeeStatus = "Checked In" | "Not Checked In";

// This describes one attendee record.
// Every attendee object passed into this page must follow this structure.
export interface AttendeeItem {
  id: number; // unique identifier used by React for rendering lists
  name: string; // attendee full name
  email: string; // attendee email address
  event: string; // event the attendee registered for
  status: AttendeeStatus; // attendee check-in state
  ticket: string; // ticket type such as VIP, General, or Online
}

// This describes one recent activity item.
// It is displayed in the Recent Activity panel.
export interface RecentActivityItem {
  id: number; // unique identifier for list rendering
  name: string; // person related to the activity
  action: string; // what happened
}

// These are the props the page expects from the parent component.
// The page does NOT create mock attendee data internally.
// Instead, real data is passed in from a parent, context, or API response.
interface AttendeesPageProps {
  attendees?: AttendeeItem[];
  recentActivity?: RecentActivityItem[];
  totalAttendees?: number;
  checkedInCount?: number;
  notCheckedInCount?: number;
}

// ===================== HELPER FUNCTION =====================

// This function returns Tailwind classes for the status badge.
// It changes the color depending on the attendee's status.
function getStatusClasses(status: AttendeeStatus) {
  switch (status) {
    case "Checked In":
      return "bg-green-100 text-green-700";
    case "Not Checked In":
      return "bg-indigo-100 text-indigo-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

// ===================== MAIN COMPONENT =====================

// This page displays attendee information for the organiser.
// It includes summary cards, search, filters, a table, and a side panel.
export default function Attendees({
  attendees = [],
  recentActivity = [],
  totalAttendees,
  checkedInCount,
  notCheckedInCount,
}: AttendeesPageProps) {
  // This state stores what the user types into the search bar.
  const [searchTerm, setSearchTerm] = useState("");

  // This state stores the selected event filter.
  const [selectedEvent, setSelectedEvent] = useState("All Events");

  // This state stores the selected status filter.
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  // This creates a unique list of event names from the attendees array.
  // It is used to populate the event filter dropdown.
  const eventOptions = useMemo(() => {
    const uniqueEvents = new Set(attendees.map((attendee) => attendee.event));
    return ["All Events", ...Array.from(uniqueEvents)];
  }, [attendees]);

  // This filters the attendees based on:
  // 1. Search input
  // 2. Selected event
  // 3. Selected status
  const filteredAttendees = useMemo(() => {
    return attendees.filter((attendee) => {
      const matchesSearch =
        attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        attendee.email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesEvent =
        selectedEvent === "All Events" || attendee.event === selectedEvent;

      const matchesStatus =
        selectedStatus === "All Status" || attendee.status === selectedStatus;

      return matchesSearch && matchesEvent && matchesStatus;
    });
  }, [attendees, searchTerm, selectedEvent, selectedStatus]);

  // These summary values are calculated automatically from the attendee data.
  // If the parent passes explicit totals, those values are used instead.
  const computedTotalAttendees = totalAttendees ?? attendees.length;
  const computedCheckedInCount =
    checkedInCount ?? attendees.filter((attendee) => attendee.status === "Checked In").length;
  const computedNotCheckedInCount =
    notCheckedInCount ??
    attendees.filter((attendee) => attendee.status === "Not Checked In").length;

  return (
    <DashboardLayout
      title="Attendees"
      subtitle="View, manage, and track everyone registered for your events."
      showSponsor
    >
      {/* ===================== SUMMARY CARDS ===================== */}
      {/* These cards give the organiser a quick overview of attendance numbers. */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">{computedTotalAttendees}</h2>
          <p className="mt-1 text-sm text-gray-400">Total Attendees</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">{computedCheckedInCount}</h2>
          <p className="mt-1 text-sm text-gray-400">Checked In</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900">{computedNotCheckedInCount}</h2>
          <p className="mt-1 text-sm text-gray-400">Not Checked In</p>
        </div>
      </div>

      {/* ===================== SEARCH SECTION ===================== */}
      {/* This lets the organiser search by attendee name or email. */}
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search attendee by name or email..."
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="button"
          className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Search
        </button>
      </div>

      {/* ===================== FILTER SECTION ===================== */}
      {/* These dropdowns filter attendees by event and by status. */}
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm outline-none"
        >
          {eventOptions.map((eventName) => (
            <option key={eventName} value={eventName}>
              {eventName}
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="rounded-xl border border-gray-100 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm outline-none"
        >
          <option value="All Status">All Status</option>
          <option value="Checked In">Checked In</option>
          <option value="Not Checked In">Not Checked In</option>
        </select>
      </div>

      {/* ===================== MAIN CONTENT SECTION ===================== */}
      {/* Left side contains the attendee table.
          Right side contains quick actions, recent activity, and tips. */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ===================== ATTENDEE TABLE ===================== */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900">Attendee List</h3>
          <p className="mt-1 text-sm text-gray-400">
            Keep track of attendance across your events.
          </p>

          {/* This wrapper allows the table to scroll horizontally on smaller screens. */}
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-gray-500">
                  <th className="rounded-l-xl px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="rounded-r-xl px-4 py-3 font-medium">Ticket</th>
                </tr>
              </thead>

              <tbody>
                {/* This loop renders one table row per attendee. */}
                {filteredAttendees.length > 0 ? (
                  filteredAttendees.map((attendee) => (
                    <tr key={attendee.id} className="border-b border-gray-100 text-gray-700">
                      <td className="px-4 py-4">{attendee.name}</td>
                      <td className="px-4 py-4">{attendee.email}</td>
                      <td className="px-4 py-4">{attendee.event}</td>
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                            attendee.status
                          )}`}
                        >
                          {attendee.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">{attendee.ticket}</td>
                    </tr>
                  ))
                ) : (
                  // This row is shown when no attendees match the current filters.
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">
                      No attendees found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===================== RIGHT SIDEBAR ===================== */}
        <div className="space-y-4">
          {/* Quick Actions panel */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-900">Quick Actions</h4>
            <div className="mt-4 space-y-3">
              <button
                type="button"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Export Attendee List
              </button>
              <button
                type="button"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Send Reminder Email
              </button>
              <button
                type="button"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-left text-sm text-gray-600 transition hover:bg-gray-50"
              >
                Download Attendee List
              </button>
            </div>
          </div>

          {/* Recent Activity panel */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-900">Recent Activity</h4>
            <div className="mt-4 space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.map((item) => (
                  <div key={item.id} className="rounded-xl bg-gray-50 p-3">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-400">{item.action}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No recent activity available.</p>
              )}
            </div>
          </div>

          {/* Tips panel */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h4 className="text-xl font-semibold text-gray-900">Tips</h4>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm text-gray-500">
              <li>Check in attendees as they arrive.</li>
              <li>Keep attendee email addresses accurate.</li>
              <li>Export the list before large events.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
