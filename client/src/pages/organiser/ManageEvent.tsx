import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Tag, Wallet, Mail, Phone, Save, Trash2 } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

// Mock attendees — replace with API call later
const mockAttendees = [
  { id: "1", name: "Kagiso Sithole", email: "kagiso@gmail.com", scannedAt: "March 25, 2026 • 9:14 AM" },
  { id: "2", name: "Mpho Dlamini", email: "mpho@gmail.com", scannedAt: "March 25, 2026 • 9:32 AM" },
  { id: "3", name: "Tebogo Nkosi", email: "tebogo@gmail.com", scannedAt: null },
  { id: "4", name: "Lesego Mokoena", email: "lesego@gmail.com", scannedAt: "March 25, 2026 • 10:01 AM" },
  { id: "5", name: "Boitumelo Kgosi", email: "boitumelo@gmail.com", scannedAt: null },
];

export default function ManageEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    title: "Developer Meetup",
    description: "Connect with developers and explore current trends in software and innovation.",
    category: "Technology",
    date: "2026-03-28",
    time: "5:00 PM - 8:00 PM",
    location: "Innovation Hub",
    price: "Free",
    capacity: "500",
    status: "Active" as "Active" | "Upcoming" | "Draft",
    organiserName: "EventHub Tech Team",
    organiserEmail: "tech@eventhub.com",
    organiserPhone: "+267 70000000",
    imageBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  });

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Will call API later
    setSaved(true);
    setIsEditing(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const statusColors = {
    Active: "bg-emerald-100 text-emerald-700",
    Upcoming: "bg-blue-100 text-blue-700",
    Draft: "bg-amber-100 text-amber-700",
  };

  return (
    <DashboardLayout
      title="Manage Event"
      subtitle="Edit event details and view attendee activity."
      showSponsor
    >
      {/* Hero Banner */}
      <section className="relative mb-6 overflow-hidden rounded-2xl p-8" style={{ background: form.imageBg }}>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase ${statusColors[form.status]}`}>
              {form.status}
            </span>
            <span className="text-xs text-white/70">{form.category}</span>
          </div>
          <h2 className="text-4xl font-bold text-white">{form.title}</h2>
          <p className="mt-2 text-sm text-white/80 max-w-2xl">{form.description}</p>

          <div className="flex flex-wrap gap-3 mt-6">
            <div className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm border border-white/30">
              <p className="text-[10px] uppercase text-white/80">Registered</p>
              <p className="text-sm font-semibold text-white">{mockAttendees.length} / {form.capacity}</p>
            </div>
            <div className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm border border-white/30">
              <p className="text-[10px] uppercase text-white/80">Checked In</p>
              <p className="text-sm font-semibold text-white">
                {mockAttendees.filter(a => a.scannedAt).length} / {mockAttendees.length}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/10" />
      </section>

      {/* Save notification */}
      {saved && (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm font-medium text-emerald-700">
          ✓ Event details saved successfully
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Image preview */}
          <div
            className="w-full h-56 rounded-2xl shadow-sm"
            style={{ background: form.imageBg }}
          />

          {/* About / Description */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-gray-900">About This Event</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                {isEditing ? "Cancel" : "Edit"}
              </button>
            </div>

            {isEditing ? (
              <textarea
                value={form.description}
                onChange={e => handleChange("description", e.target.value)}
                rows={4}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
              />
            ) : (
              <p className="text-sm text-gray-500 leading-relaxed">{form.description}</p>
            )}
          </div>

          {/* Event Information */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-5">Event Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <EditableField icon={<Calendar size={16} />} label="Date" value={form.date} field="date" isEditing={isEditing} onChange={handleChange} type="date" />
              <EditableField icon={<Clock size={16} />} label="Time" value={form.time} field="time" isEditing={isEditing} onChange={handleChange} />
              <EditableField icon={<MapPin size={16} />} label="Venue" value={form.location} field="location" isEditing={isEditing} onChange={handleChange} />
              <EditableField icon={<Users size={16} />} label="Capacity" value={form.capacity} field="capacity" isEditing={isEditing} onChange={handleChange} />
              <EditableField icon={<Tag size={16} />} label="Category" value={form.category} field="category" isEditing={isEditing} onChange={handleChange} />
              <EditableField icon={<Wallet size={16} />} label="Entry Fee" value={form.price} field="price" isEditing={isEditing} onChange={handleChange} />
            </div>

            {isEditing && (
              <div className="mt-5">
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide mb-2">Status</p>
                <div className="flex gap-2">
                  {(["Active", "Upcoming", "Draft"] as const).map(s => (
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
                O
              </div>
              <div className="flex-1 space-y-2">
                <EditableField icon={<Users size={16} />} label="Name" value={form.organiserName} field="organiserName" isEditing={isEditing} onChange={handleChange} />
                <EditableField icon={<Mail size={16} />} label="Email" value={form.organiserEmail} field="organiserEmail" isEditing={isEditing} onChange={handleChange} />
                <EditableField icon={<Phone size={16} />} label="Phone" value={form.organiserPhone} field="organiserPhone" isEditing={isEditing} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Attendees</h3>
              <span className="text-xs text-gray-400">{mockAttendees.length} registered</span>
            </div>

            <div className="space-y-3">
              {mockAttendees.map(attendee => (
                <div
                  key={attendee.id}
                  className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold">
                      {attendee.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{attendee.name}</p>
                      <p className="text-xs text-gray-400">{attendee.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {attendee.scannedAt ? (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        Checked In
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        Not Yet
                      </span>
                    )}
                    {attendee.scannedAt && (
                      <p className="text-[10px] text-gray-400 mt-1">{attendee.scannedAt}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Actions Sidebar */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sticky top-6">
            <h3 className="text-base font-bold text-gray-900 mb-1">Event Actions</h3>
            <p className="text-xs text-gray-400 mb-5">Manage this event's status and details.</p>

            <div className="space-y-3">
              {isEditing ? (
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
                >
                  <Save size={15} />
                  Save Changes
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
                >
                  Edit Event
                </button>
              )}

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
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <h4 className="text-xs font-bold text-gray-900 mb-3">Event Stats</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Registered</span>
                  <span className="font-bold text-gray-900">{mockAttendees.length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Checked In</span>
                  <span className="font-bold text-gray-900">{mockAttendees.filter(a => a.scannedAt).length}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Check-in Rate</span>
                  <span className="font-bold text-indigo-600">
                    {Math.round((mockAttendees.filter(a => a.scannedAt).length / mockAttendees.length) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Capacity</span>
                  <span className="font-bold text-gray-900">{form.capacity}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-100 pt-5">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-red-100 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50"
              >
                <Trash2 size={15} />
                Delete Event
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface EditableFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  field: string;
  isEditing: boolean;
  onChange: (field: string, value: string) => void;
  type?: string;
}

function EditableField({ icon, label, value, field, isEditing, onChange, type = "text" }: EditableFieldProps) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{label}</p>
      {isEditing ? (
        <input
          type={type}
          value={value}
          onChange={e => onChange(field, e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{icon}</span>
          <span className="text-sm font-semibold text-gray-800">{value}</span>
        </div>
      )}
    </div>
  );
}