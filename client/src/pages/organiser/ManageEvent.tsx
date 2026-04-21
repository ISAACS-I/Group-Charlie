import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar, Clock, MapPin, Users, Tag, Wallet,
  Mail, Phone, Save, Trash2, RefreshCw, AlertCircle,
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import type { Event } from "../../types";

const API_BASE = "http://localhost:5001/api";

function getToken(): string {
  try {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored).token : "";
  } catch { return ""; }
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Attendee {
  id: string;
  name: string;
  email: string;
  scannedAt: string | null;
}

interface EditableForm {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: string;
  capacity: string;
  status: "Active" | "Upcoming" | "Draft";
  organiserName: string;
  organiserEmail: string;
  organiserPhone: string;
  hasAgeRestriction: boolean;
  minAge: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
interface EditableFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  field: string;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
  type?: string;
}

function EditableField({
  icon, label, value, field, isEditing, onChange, type = "text",
}: EditableFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{label}</p>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-semibold text-gray-800">{value || "—"}</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function ManageEvent() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Loading / error states
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState<string | null>(null);
  const [isEditing, setIsEditing]       = useState(false);
  const [isSaving, setIsSaving]         = useState(false);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [saved, setSaved]               = useState(false);
  const [saveError, setSaveError]       = useState<string | null>(null);

  // Event data
  const [event, setEvent]               = useState<Event | null>(null);
  const [attendees, setAttendees]       = useState<Attendee[]>([]);
  const [attendeesLoading, setAttendeesLoading] = useState(false);

  // Editable form state (populated once event loads)
  const [form, setForm] = useState<EditableForm>({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    location: "",
    price: "0",
    capacity: "",
    status: "Draft",
    organiserName: "",
    organiserEmail: "",
    organiserPhone: "",
    hasAgeRestriction: false,
    minAge: "",
  });

  // ─── Fetch Event ─────────────────────────────────────────────────────────
  const fetchEvent = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to load event");
      const data: Event = await res.json();
      setEvent(data);
      populateForm(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // ─── Fetch Attendees ─────────────────────────────────────────────────────
  const fetchAttendees = useCallback(async () => {
    if (!id) return;
    setAttendeesLoading(true);
    try {
      // Fetch bookings for this event from the admin analytics/bookings endpoint
      const res = await fetch(`${API_BASE}/bookings/my`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) throw new Error("Failed to load attendees");
      const allBookings = await res.json();

      // Filter bookings for this specific event
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const eventBookings = allBookings.filter((b: any) => {
        const eventId = b.event?._id || b.event;
        return String(eventId) === String(id);
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mapped: Attendee[] = eventBookings.map((b: any) => ({
        id: b._id,
        name: b.user
          ? `${b.user.firstName || ""} ${b.user.lastName || ""}`.trim() || "Unknown"
          : "Unknown",
        email: b.user?.email || "N/A",
        scannedAt: b.scannedAt || null,
      }));
      setAttendees(mapped);
    } catch {
      // Silently fail – attendees section will just show empty
      setAttendees([]);
    } finally {
      setAttendeesLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchEvent();
    fetchAttendees();
  }, [fetchEvent, fetchAttendees]);

  // ─── Populate Form From Event ─────────────────────────────────────────────
  const populateForm = (data: Event) => {
    const organiser = data.organiser;
    setForm({
      title:          data.title || "",
      description:    data.description || "",
      category:       data.category || "",
      date:           data.date
        ? String(data.date).split("T")[0]
        : "",
      time:           data.time || "",
      location:       data.location || "",
      price:          String(data.price ?? "0"),
      capacity:       String(data.capacity ?? ""),
      status:         (data.status as "Active" | "Upcoming" | "Draft") || "Draft",
      organiserName:  organiser
        ? `${organiser.firstName} ${organiser.lastName}`
        : user ? `${user.firstName} ${user.lastName}` : "",
      organiserEmail: organiser?.email || user?.email || "",
      organiserPhone: organiser?.phone || "",
      hasAgeRestriction: data.hasAgeRestriction || false,
      minAge:         data.minAge != null ? String(data.minAge) : "",
    });
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // ─── Cancel Edit ─────────────────────────────────────────────────────────
  const handleCancelEdit = () => {
    if (event) populateForm(event);
    setIsEditing(false);
    setSaveError(null);
  };

  // ─── Save Event ───────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!id) return;
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title:            form.title,
          description:      form.description,
          category:         form.category,
          date:             form.date,
          time:             form.time,
          location:         form.location,
          price:            parseFloat(form.price) || 0,
          capacity:         form.capacity ? parseInt(form.capacity) : undefined,
          status:           form.status,
          hasAgeRestriction: form.hasAgeRestriction,
          minAge:           form.hasAgeRestriction && form.minAge
            ? parseInt(form.minAge)
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to save event");

      // Update local event state with new data
      setEvent(data.event || data);
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Delete Event ─────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!id) return;
    if (!confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${API_BASE}/events/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to delete event");
      }
      navigate("/my-events");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const imageBg =
    event?.imageBg ?? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)";

  const statusColors: Record<string, string> = {
    Active:   "bg-emerald-100 text-emerald-700",
    Upcoming: "bg-blue-100 text-blue-700",
    Draft:    "bg-amber-100 text-amber-700",
  };

  const checkedInCount = attendees.filter((a) => a.scannedAt).length;

  // ─── Loading / Error States ───────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout
        title="Manage Event"
        subtitle="Edit event details and view attendee activity."
        showSponsor
      >
        <div className="flex h-96 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
        </div>
      </DashboardLayout>
    );
  }

  if (error || !event) {
    return (
      <DashboardLayout
        title="Manage Event"
        subtitle="Edit event details and view attendee activity."
        showSponsor
      >
        <div className="flex h-96 flex-col items-center justify-center gap-4">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center">
            <AlertCircle size={32} className="mx-auto mb-3 text-red-500" />
            <p className="text-base font-bold text-red-900">
              {error || "Event not found"}
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={fetchEvent}
                className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                <RefreshCw size={14} />
                Try Again
              </button>
              <button
                onClick={() => navigate("/my-events")}
                className="rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
              >
                Back to My Events
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ─── Main Render ──────────────────────────────────────────────────────────
  return (
    <DashboardLayout
      title="Manage Event"
      subtitle="Edit event details and view attendee activity."
      showSponsor
    >
      {/* Hero Banner */}
      <section
        className="relative mb-6 overflow-hidden rounded-2xl p-8"
        style={{ background: imageBg }}
      >
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${
                statusColors[form.status] ?? "bg-gray-100 text-gray-600"
              }`}
            >
              {form.status}
            </span>
            <span className="text-xs text-white/70">{form.category}</span>
          </div>
          <h2 className="text-4xl font-bold text-white">{form.title}</h2>
          <p className="mt-2 text-sm text-white/80 max-w-2xl">{form.description}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm border border-white/30">
              <p className="text-[10px] uppercase text-white/80">Registered</p>
              <p className="text-sm font-semibold text-white">
                {attendees.length} {form.capacity ? `/ ${form.capacity}` : ""}
              </p>
            </div>
            <div className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm border border-white/30">
              <p className="text-[10px] uppercase text-white/80">Checked In</p>
              <p className="text-sm font-semibold text-white">
                {checkedInCount} / {attendees.length || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/10" />
      </section>

      {/* Save notifications */}
      {saved && (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
          ✓ Event details saved successfully
        </div>
      )}
      {saveError && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-700">
          ✕ {saveError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left Column ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Image / Banner Preview */}
          <div
            className="w-full h-56 rounded-2xl shadow-sm"
            style={{ background: imageBg }}
          />

          {/* About / Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">About This Event</h3>
              <button
                type="button"
                onClick={() => isEditing ? handleCancelEdit() : setIsEditing(true)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Event Title
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    rows={4}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
                  />
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 leading-relaxed">
                {form.description || "No description provided."}
              </p>
            )}
          </div>

          {/* Event Information */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-5">Event Information</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <EditableField
                icon={<Calendar size={16} />}
                label="Date"
                value={form.date}
                field="date"
                isEditing={isEditing}
                onChange={handleChange}
                type="date"
              />
              <EditableField
                icon={<Clock size={16} />}
                label="Time"
                value={form.time}
                field="time"
                isEditing={isEditing}
                onChange={handleChange}
                type="time"
              />
              <EditableField
                icon={<MapPin size={16} />}
                label="Venue"
                value={form.location}
                field="location"
                isEditing={isEditing}
                onChange={handleChange}
              />
              <EditableField
                icon={<Users size={16} />}
                label="Capacity"
                value={form.capacity}
                field="capacity"
                isEditing={isEditing}
                onChange={handleChange}
                type="number"
              />
              {isEditing ? (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Category</p>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange("category", e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    {[
                      "Technology","Business","Music","Sports",
                      "Arts & Culture","Food & Drink","Community","Education","Other",
                    ].map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              ) : (
                <EditableField
                  icon={<Tag size={16} />}
                  label="Category"
                  value={form.category}
                  field="category"
                  isEditing={false}
                  onChange={handleChange}
                />
              )}
              <EditableField
                icon={<Wallet size={16} />}
                label="Entry Fee (P)"
                value={form.price}
                field="price"
                isEditing={isEditing}
                onChange={handleChange}
                type="number"
              />
            </div>

            {/* Age Restriction */}
            {isEditing && (
              <div className="mt-5 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.hasAgeRestriction}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        hasAgeRestriction: e.target.checked,
                        minAge: e.target.checked ? prev.minAge : "",
                      }))
                    }
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-600">Age restriction applies</span>
                </label>
                {form.hasAgeRestriction && (
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={form.minAge}
                      onChange={(e) => handleChange("minAge", e.target.value)}
                      placeholder="e.g. 18"
                      min="1"
                      max="100"
                      className="w-24 rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                    <span className="text-sm text-gray-500">years and older</span>
                  </div>
                )}
              </div>
            )}

            {/* Age restriction display (not editing) */}
            {!isEditing && form.hasAgeRestriction && form.minAge && (
              <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-2.5 text-xs text-amber-700">
                Age restriction: {form.minAge}+ only
              </div>
            )}

            {/* Status toggle (edit mode) */}
            {isEditing && (
              <div className="mt-5">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-2">
                  Status
                </p>
                <div className="flex gap-2">
                  {(["Active", "Upcoming", "Draft"] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleChange("status", s)}
                      className={`rounded-xl px-4 py-2 text-xs font-semibold transition-colors ${
                        form.status === s
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Organiser Details */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Organiser Details</h3>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {form.organiserName.charAt(0).toUpperCase() || "O"}
              </div>
              <div className="flex-1 space-y-2">
                <EditableField
                  icon={<Users size={16} />}
                  label="Name"
                  value={form.organiserName}
                  field="organiserName"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <EditableField
                  icon={<Mail size={16} />}
                  label="Email"
                  value={form.organiserEmail}
                  field="organiserEmail"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
                <EditableField
                  icon={<Phone size={16} />}
                  label="Phone"
                  value={form.organiserPhone}
                  field="organiserPhone"
                  isEditing={isEditing}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Attendees</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{attendees.length} registered</span>
                <button
                  type="button"
                  onClick={fetchAttendees}
                  className="text-gray-400 hover:text-indigo-600 transition-colors"
                  title="Refresh attendees"
                >
                  <RefreshCw size={14} />
                </button>
              </div>
            </div>

            {attendeesLoading ? (
              <div className="flex justify-center py-8">
                <div className="h-6 w-6 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
              </div>
            ) : attendees.length > 0 ? (
              <div className="space-y-3">
                {attendees.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                        {attendee.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{attendee.name}</p>
                        <p className="text-xs text-gray-400">{attendee.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      {attendee.scannedAt ? (
                        <>
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                            Checked In
                          </span>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(attendee.scannedAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </p>
                        </>
                      ) : (
                        <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          Not Yet
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center">
                <p className="text-sm text-gray-400">No attendees registered yet.</p>
                <p className="text-xs text-gray-300 mt-1">
                  Registrations will appear here once people book this event.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Column — Actions Sidebar ──────────────────────────── */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sticky top-6">
            <h3 className="text-base font-bold text-gray-900 mb-1">Event Actions</h3>
            <p className="text-xs text-gray-400 mb-5">Manage this event's status and details.</p>

            <div className="space-y-3">
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={15} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
                  >
                    Edit Event
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/attendees")}
                    className="w-full rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    View All Attendees
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/analytics")}
                    className="w-full rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
                  >
                    View Analytics
                  </button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold text-gray-900 mb-3">Event Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Registered</span>
                  <span className="font-bold text-gray-900">{attendees.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Checked In</span>
                  <span className="font-bold text-gray-900">{checkedInCount}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Check-in Rate</span>
                  <span className="font-bold text-indigo-600">
                    {attendees.length > 0
                      ? `${Math.round((checkedInCount / attendees.length) * 100)}%`
                      : "—"}
                  </span>
                </div>
                {form.capacity && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Capacity</span>
                    <span className="font-bold text-gray-900">{form.capacity}</span>
                  </div>
                )}
                {form.capacity && attendees.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{
                          width: `${Math.min(
                            (attendees.length / parseInt(form.capacity)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 text-right">
                      {attendees.length} / {form.capacity} spots filled
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick info (read-only) */}
            <div className="mt-4 border-t border-gray-100 pt-4 space-y-2">
              {form.date && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={12} className="text-gray-400" />
                  {new Date(form.date).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric",
                  })}
                </div>
              )}
              {form.time && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={12} className="text-gray-400" />
                  {form.time}
                </div>
              )}
              {form.location && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={12} className="text-gray-400" />
                  {form.location}
                </div>
              )}
              {form.price && (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Wallet size={12} className="text-gray-400" />
                  {parseFloat(form.price) === 0 ? "Free" : `P${form.price}`}
                </div>
              )}
            </div>

            {/* Danger zone */}
            <div className="mt-6 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-100 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-400 border-t-transparent" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete Event
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}