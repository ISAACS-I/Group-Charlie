import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Tag, Wallet, Mail, Phone, Plus, X, Heart } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import type { Event } from "../../types";
import {
  fetchEventById,
  bookEvent,
  saveEvent,
  unsaveEvent,
  isEventSaved,
} from "../../utils/eventApi";

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Group booking states
  const [members, setMembers] = useState<{ name: string; email: string }[]>([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupSent, setGroupSent] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  // Button states
  const [isBooking, setIsBooking] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSavingEvent, setIsSavingEvent] = useState(false);

  // Fetch event on mount
  useEffect(() => {
    const loadEvent = async () => {
      if (!id) {
        setError("Event ID not found");
        setLoading(false);
        return;
      }

      try {
        const data = await fetchEventById(id);
        setEvent(data);

        // Check if event is saved
        if (user) {
          const saved = await isEventSaved(id);
          setIsSaved(saved);
        }
      } catch (err) {
        const error = err instanceof Error ? err.message : "Failed to load event details";
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id, user]);

  const addMember = () => setMembers([...members, { name: "", email: "" }]);

  const removeMember = (index: number) =>
    setMembers(members.filter((_, i) => i !== index));

  const updateMember = (index: number, field: string, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
  };

  const handleBookEvent = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/browse-events/${id}` } });
      return;
    }

    setIsBooking(true);
    setBookingMessage(null);

    try {
      await bookEvent(id!);
      setIsBooked(true);
      setBookingMessage({ type: "success", text: "Event booked successfully! Check your bookings." });
      setTimeout(() => setBookingMessage(null), 5000);
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to book event";
      setBookingMessage({
        type: "error",
        text: error,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const handleSaveEvent = async () => {
    if (!user) {
      navigate("/login", { state: { from: `/browse-events/${id}` } });
      return;
    }

    setIsSavingEvent(true);

    try {
      if (isSaved) {
        await unsaveEvent(id!);
        setIsSaved(false);
      } else {
        await saveEvent(id!);
        setIsSaved(true);
      }
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to save event";
      console.error("Error toggling save:", error);
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleGroupBooking = async () => {
    const valid = members.every(m => m.name.trim() && m.email.trim());
    if (!valid) {
      setGroupError("Please fill in all name and email fields.");
      return;
    }

    setGroupError(null);
    setIsSending(true);

    try {
      const authUser = JSON.parse(localStorage.getItem("authUser") || "{}");
      const token = authUser.token;

      if (!token) {
        navigate("/login", { state: { from: `/browse-events/${id}` } });
        return;
      }

      const res = await fetch("http://localhost:5001/api/bookings/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: id, members }),
      });

      if (!res.ok) throw new Error("Failed to send group booking");

      setGroupSent(true);
      setMembers([]);
      setShowGroupForm(false);
      setTimeout(() => setGroupSent(false), 5000);
    } catch (err) {
      const error = err instanceof Error ? err.message : "Failed to send group booking";
      setGroupError(error);
    } finally {
      setIsSending(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout
        title="Event Details"
        subtitle="Loading event information..."
        showSponsor
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !event) {
    return (
      <DashboardLayout
        title="Event Details"
        subtitle="Error loading event"
        showSponsor
      >
        <div className="max-w-2xl mx-auto rounded-2xl border border-red-100 bg-red-50 p-6">
          <h3 className="text-lg font-bold text-red-900 mb-2">Unable to Load Event</h3>
          <p className="text-sm text-red-700 mb-4">{error || "Event not found"}</p>
          <button
            onClick={() => navigate("/browse-events")}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 transition-colors"
          >
            Back to Events
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const organiserName = event.organiser
    ? `${event.organiser.firstName} ${event.organiser.lastName}`
    : "Event Organiser";
  const organiserEmail = event.organiser?.email || "";
  const organiserPhone = event.organiser?.phone || "";

  return (
    <DashboardLayout
      title="Event Details"
      subtitle="Learn more about this event and complete your registration."
      showSponsor
    >
      {/* Hero Banner */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8">
        <div className="relative z-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-white/80">
            {event.category || "Event"}
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">{event.title}</h2>
          <p className="mt-2 text-sm text-indigo-100 max-w-2xl mb-6">{event.description}</p>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm border border-white/30">
              <p className="text-[10px] uppercase text-white/80">Registration</p>
              <p className="text-sm font-semibold text-white">QR Access Included</p>
            </div>
            <div className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm border border-white/30">
              <p className="text-[10px] uppercase text-white/80">Status</p>
              <p className="text-sm font-semibold text-white">{event.status || "Active"}</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/10" />
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photo Gallery */}
          <div className="grid grid-cols-3 gap-2">
            <div
              className="col-span-2 h-56 rounded-2xl"
              style={{
                background: event.imageBg || "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              }}
            />
            <div className="flex flex-col gap-2">
              <div
                className="flex-1 rounded-2xl"
                style={{ background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" }}
              />
              <div
                className="flex-1 rounded-2xl"
                style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }}
              />
            </div>
          </div>

          {/* About */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">About This Event</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{event.description}</p>
          </div>

          {/* Event Info */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-5">Event Information</h3>
            {event.hasAgeRestriction && event.minAge && (
              <InfoItem icon={<Users size={16} />} label="Age Requirement" value={`${event.minAge}+`} />
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {event.date && (
                <InfoItem icon={<Calendar size={16} />} label="Date" value={String(event.date).split("T")[0]} />
              )}
              {event.time && <InfoItem icon={<Clock size={16} />} label="Time" value={event.time} />}
              {event.location && (
                <InfoItem icon={<MapPin size={16} />} label="Venue" value={event.location} />
              )}
              {event.capacity && (
                <InfoItem icon={<Users size={16} />} label="Capacity" value={`${event.capacity} Spots`} />
              )}
              {event.category && <InfoItem icon={<Tag size={16} />} label="Category" value={event.category} />}
              {typeof event.price === "number" && (
                <InfoItem
                  icon={<Wallet size={16} />}
                  label="Entry Fee"
                  value={event.price === 0 ? "Free" : `P${event.price}`}
                />
              )}
              {event.directions && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Directions</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.directions}</p>
                </div>
              )}
            </div>

            {event.location && (
              <a
                href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(event.location)}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <MapPin size={14} />
                View on Google Maps
              </a>
            )}
          </div>

          {/* Organiser */}
          {event.organiser && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-base font-bold text-gray-900 mb-4">Organiser Details</h3>
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {event.organiser.firstName[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{organiserName}</p>
                  <div className="mt-1 space-y-1 text-xs text-gray-400">
                    <span className="flex items-center gap-2">
                      <Mail size={12} />
                      {organiserEmail}
                    </span>
                    {organiserPhone && (
                      <span className="flex items-center gap-2">
                        <Phone size={12} />
                        {organiserPhone}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column — Registration Sidebar */}
        <div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sticky top-6">
            <span className="rounded-md bg-green-100 px-2 py-1 text-[10px] font-bold uppercase text-green-700">
              Open Registration
            </span>
            <h3 className="mt-3 text-base font-bold text-gray-900">Register for this Event</h3>
            <p className="mt-1 text-xs text-gray-400">Complete your booking and receive QR access for entry.</p>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Fee</span>
                <span className="font-bold text-gray-900">
                  {typeof event.price === "number" ? (event.price === 0 ? "Free" : `P${event.price}`) : "TBD"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Capacity</span>
                <span className="font-bold text-gray-900">{event.capacity || "Unlimited"}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-400">Access</span>
                <span className="font-bold text-gray-900">QR Code Ticket</span>
              </div>
            </div>

            {bookingMessage && (
              <div
                className={`mt-4 rounded-xl border px-4 py-3 text-xs font-medium ${
                  bookingMessage.type === "success"
                    ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                    : "border-red-100 bg-red-50 text-red-700"
                }`}
              >
                {bookingMessage.type === "success" ? "✓" : "✕"} {bookingMessage.text}
              </div>
            )}

            {groupSent && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs font-medium text-emerald-700">
                ✓ QR passes sent to all group members!
              </div>
            )}

            <div className="mt-5 space-y-3">
              {event.hasAgeRestriction && event.minAge && (
                <div className="mt-4 rounded-xl bg-amber-50 border border-amber-100 px-4 py-2.5 text-xs text-amber-700">
                  This event is restricted to attendees aged {event.minAge} and above.
                </div>
              )}
              <button
                type="button"
                onClick={handleBookEvent}
                disabled={isBooking || isBooked}
                className={`w-full rounded-xl py-3 text-sm font-bold transition-colors ${
                  isBooked
                    ? "bg-green-100 text-green-700 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
                }`}
              >
                {isBooking ? "Booking..." : isBooked ? "✓ Event Booked" : "Register Now"}
              </button>
              <button
                type="button"
                onClick={handleSaveEvent}
                disabled={isSavingEvent}
                className={`w-full rounded-xl py-3 text-sm font-bold transition-colors flex items-center justify-center gap-2 ${
                  isSaved
                    ? "bg-pink-100 text-pink-600 hover:bg-pink-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                } disabled:opacity-50`}
              >
                <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
                {isSavingEvent ? "..." : isSaved ? "Saved" : "Save Event"}
              </button>
            </div>

            {/* Group Booking */}
            <div className="mt-4 border-t border-gray-100 pt-4">
              <button
                type="button"
                onClick={() => setShowGroupForm(!showGroupForm)}
                className="w-full rounded-xl border border-indigo-200 py-2.5 text-sm font-semibold text-indigo-600 transition-colors hover:bg-indigo-50"
              >
                {showGroupForm ? "Hide Group Booking" : "Registering as a group?"}
              </button>

              {showGroupForm && (
                <div className="mt-4 space-y-3">
                  <p className="text-xs text-gray-400">
                    Add each person's details. They will each receive their own QR pass via email.
                  </p>

                  {members.map((member, index) => (
                    <div key={index} className="rounded-xl border border-gray-100 bg-gray-50 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-semibold text-gray-600">Person {index + 1}</p>
                        <button
                          type="button"
                          onClick={() => removeMember(index)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={member.name}
                        onChange={(e) => updateMember(index, "name", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={member.email}
                        onChange={(e) => updateMember(index, "email", e.target.value)}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                      />
                    </div>
                  ))}

                  {groupError && <p className="text-xs text-red-500">{groupError}</p>}

                  <button
                    type="button"
                    onClick={addMember}
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-500 transition-colors hover:border-indigo-300 hover:text-indigo-600"
                  >
                    <Plus size={14} />
                    Add Person
                  </button>

                  {members.length > 0 && (
                    <button
                      type="button"
                      onClick={handleGroupBooking}
                      disabled={isSending}
                      className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                    >
                      {isSending
                        ? "Sending..."
                        : `Send QR Passes (${members.length} ${members.length === 1 ? "person" : "people"})`}
                    </button>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6">
              <h4 className="text-xs font-bold text-gray-900 mb-2">Registration Notes</h4>
              <ul className="space-y-1.5 text-[11px] text-gray-400 list-disc pl-4">
                <li>Bring your QR code on event day.</li>
                <li>Registration closes once event has commenced.</li>
                <li>Refund policy may depend on organiser rules.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({ icon, label, value }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-semibold text-gray-800">{value}</span>
      </div>
    </div>
  );
}