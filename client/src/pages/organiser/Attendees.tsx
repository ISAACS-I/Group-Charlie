import { useEffect, useMemo, useState, useCallback } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";

const API_BASE = "http://localhost:5001/api";

function getToken(): string {
  try {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored).token : "";
  } catch { return ""; }
}

type AttendeeStatus = "Checked In" | "Not Checked In";

interface AttendeeItem {
  id:     string;
  name:   string;
  email:  string;
  event:  string;
  status: AttendeeStatus;
  date:   string;
}

interface RecentActivityItem {
  id:     string;
  name:   string;
  action: string;
  event:  string;
  time:   string;
}

function StatusBadge({ status }: { status: AttendeeStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
      status === "Checked In" ? "bg-green-100 text-green-700" : "bg-indigo-100 text-indigo-700"
    }`}>
      {status}
    </span>
  );
}

function StatsCard({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
      <p className="mt-1 text-sm text-gray-400">{label}</p>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900">
      {label}
    </button>
  );
}

export default function AttendeesPage() {
  const [attendees,      setAttendees]      = useState<AttendeeItem[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [error,          setError]          = useState<string | null>(null);
  const [searchTerm,     setSearchTerm]     = useState("");
  const [selectedEvent,  setSelectedEvent]  = useState("All Events");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const loadAttendees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/bookings/attendees`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to load attendees");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: any[] = await res.json();

      const mapped: AttendeeItem[] = data.map(b => ({
        id:     b._id,
        name:   b.user ? `${b.user.firstName} ${b.user.lastName}`.trim() : "Unknown",
        email:  b.user?.email ?? "N/A",
        event:  b.event?.title ?? "Unknown Event",
        status: b.scannedAt ? "Checked In" : "Not Checked In",
        date:   b.createdAt
          ? new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "",
      }));

      setAttendees(mapped);
    } catch {
      setError("Could not load attendees");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAttendees(); }, [loadAttendees]);

  // ─── Derived data ─────────────────────────────────────────────────────────
  const eventOptions = useMemo(() => {
    const unique = new Set(attendees.map(a => a.event));
    return ["All Events", ...Array.from(unique)];
  }, [attendees]);

  const filtered = useMemo(() => attendees.filter(a => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent  = selectedEvent  === "All Events"  || a.event  === selectedEvent;
    const matchesStatus = selectedStatus === "All Status"  || a.status === selectedStatus;
    return matchesSearch && matchesEvent && matchesStatus;
  }), [attendees, searchTerm, selectedEvent, selectedStatus]);

  const checkedInCount    = attendees.filter(a => a.status === "Checked In").length;
  const notCheckedInCount = attendees.filter(a => a.status === "Not Checked In").length;

  // ─── Recent activity — last 5 registrations ───────────────────────────────
  const recentActivity: RecentActivityItem[] = useMemo(() =>
    attendees.slice(0, 5).map(a => ({
      id:     a.id,
      name:   a.name,
      action: a.status === "Checked In" ? "Checked in for" : "Registered for",
      event:  a.event,
      time:   a.date,
    }))
  , [attendees]);

  // ─── Export to CSV ────────────────────────────────────────────────────────
  const handleExport = () => {
    const rows = [
      ["Name", "Email", "Event", "Status", "Date"],
      ...filtered.map(a => [a.name, a.email, a.event, a.status, a.date]),
    ];
    const csv  = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href     = url;
    link.download = "attendees.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <DashboardLayout
      title="Attendees"
      subtitle="View, manage, and track everyone registered for your events."
      showSponsor
    >
      <div className="space-y-5">

        {/* Stats */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatsCard value={loading ? "..." : attendees.length} label="Total Attendees" />
          <StatsCard value={loading ? "..." : checkedInCount}   label="Checked In" />
          <StatsCard value={loading ? "..." : notCheckedInCount} label="Not Checked In" />
        </section>

        {/* Search */}
        <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search attendee by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-indigo-500"
            />
            <button type="button"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700">
              Search
            </button>
          </div>
        </section>

        {/* Filters */}
        <section className="flex flex-col gap-3 sm:flex-row">
          <select value={selectedEvent} onChange={(e) => setSelectedEvent(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-indigo-500">
            {eventOptions.map(e => <option key={e}>{e}</option>)}
          </select>
          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none focus:border-indigo-500">
            <option>All Status</option>
            <option>Checked In</option>
            <option>Not Checked In</option>
          </select>
        </section>

        {/* Main content */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[2fr_0.9fr]">

          {/* Table */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900">Attendee List</h2>
              <p className="mt-1 text-sm text-gray-400">
                {loading ? "Loading..." : `${filtered.length} attendee${filtered.length !== 1 ? "s" : ""} found`}
              </p>
            </div>

            {/* Loading */}
            {loading && (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 rounded-xl bg-gray-100 animate-pulse" />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="py-10 text-center">
                <p className="text-sm text-red-500">{error}</p>
                <button onClick={loadAttendees}
                  className="mt-3 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
                  Try Again
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <div className="overflow-x-auto">
                <table className="min-w-full border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-left text-xs font-semibold uppercase tracking-wide text-gray-400">
                      <th className="rounded-l-xl bg-gray-50 px-4 py-3">Name</th>
                      <th className="bg-gray-50 px-4 py-3">Email</th>
                      <th className="bg-gray-50 px-4 py-3">Event</th>
                      <th className="bg-gray-50 px-4 py-3">Status</th>
                      <th className="rounded-r-xl bg-gray-50 px-4 py-3">Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length > 0 ? (
                      filtered.map(a => (
                        <tr key={a.id} className="text-sm text-gray-700">
                          <td className="border-b border-gray-100 px-4 py-3 font-medium">{a.name}</td>
                          <td className="border-b border-gray-100 px-4 py-3 text-gray-500">{a.email}</td>
                          <td className="border-b border-gray-100 px-4 py-3">{a.event}</td>
                          <td className="border-b border-gray-100 px-4 py-3"><StatusBadge status={a.status} /></td>
                          <td className="border-b border-gray-100 px-4 py-3 text-gray-400">{a.date}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-400">
                          No attendees found for the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Quick Actions</h3>
              <div className="mt-4 space-y-3">
                <ActionButton label="Export Attendee List" onClick={handleExport} />
                <ActionButton label="Download Attendee List" onClick={handleExport} />
              </div>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
              <div className="mt-4 space-y-3">
                {loading ? (
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
                  ))
                ) : recentActivity.length > 0 ? (
                  recentActivity.map(a => (
                    <div key={a.id} className="rounded-xl bg-gray-50 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">{a.name}</p>
                      <p className="text-xs text-gray-500">{a.action} {a.event}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No recent activity.</p>
                )}
              </div>
            </div>

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