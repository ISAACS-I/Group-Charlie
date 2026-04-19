import { useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Tag, Wallet, Mail, Phone, Plus, X } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function EventDetails() {
  const { id } = useParams();

  const event = {
    id,
    category: "Culture • Food • Music",
    title: "Dithubaruba",
    description: "Experience culture, music, food, and tradition in one unforgettable celebration.",
    date: "March 25, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Molepolole Stadium",
    directions: "From the main road, turn left at the BP garage. The stadium is the second building on the right.",
    spotsLeft: 247,
    totalSpots: 500,
    price: "P50",
    imageBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    organiserName: "EventHub Cultural Team",
    organiserEmail: "culture@eventhub.com",
    organiserPhone: "+267 70000000",
  };

  const [members, setMembers] = useState<{ name: string; email: string }[]>([]);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [groupSent, setGroupSent] = useState(false);
  const [groupError, setGroupError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const addMember = () => setMembers([...members, { name: "", email: "" }]);

  const removeMember = (index: number) =>
    setMembers(members.filter((_, i) => i !== index));

  const updateMember = (index: number, field: string, value: string) => {
    const updated = [...members];
    updated[index] = { ...updated[index], [field]: value };
    setMembers(updated);
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
      const res = await fetch("http://localhost:5001/api/bookings/group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ eventId: event.id, members }),
      });

      if (!res.ok) throw new Error("Failed to send group booking");

      setGroupSent(true);
      setMembers([]);
      setShowGroupForm(false);
    } catch (err: any) {
      setGroupError(err.message);
    } finally {
      setIsSending(false);
    }
  };

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
            {event.category}
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white">{event.title}</h2>
          <p className="mt-2 text-sm text-indigo-100 max-w-2xl mb-6">{event.description}</p>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm border border-white/30">
              <p className="text-[10px] uppercase text-white/80">Registration</p>
              <p className="text-sm font-semibold text-white">QR Access Included</p>
            </div>
            <div className="rounded-xl bg-white/20 px-4 py-2.5 backdrop-blur-sm border border-white/30">
              <p className="text-[10px] uppercase text-white/80">Available Spots</p>
              <p className="text-sm font-semibold text-white">{event.spotsLeft} / {event.totalSpots} Left</p>
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
            <div className="col-span-2 h-56 rounded-2xl" style={{ background: event.imageBg }} />
            <div className="flex flex-col gap-2">
              <div className="flex-1 rounded-2xl" style={{ background: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)" }} />
              <div className="flex-1 rounded-2xl" style={{ background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" }} />
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <InfoItem icon={<Calendar size={16} />} label="Date" value={event.date} />
              <InfoItem icon={<Clock size={16} />} label="Time" value={event.time} />
              <InfoItem icon={<MapPin size={16} />} label="Venue" value={event.location} />
              <InfoItem icon={<Users size={16} />} label="Available Spots" value={`${event.spotsLeft} / ${event.totalSpots}`} />
              <InfoItem icon={<Tag size={16} />} label="Category" value={event.category} />
              <InfoItem icon={<Wallet size={16} />} label="Entry Fee" value={event.price} />
              {event.directions && (
                <div className="space-y-1 sm:col-span-2">
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">Directions</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{event.directions}</p>
                </div>
              )}
            </div>
            
            <a
              href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(event.location)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <MapPin size={14} />
              View on Google Maps
            </a>
          </div>

          {/* Organiser */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Organiser Details</h3>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                O
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{event.organiserName}</p>
                <div className="mt-1 space-y-1 text-xs text-gray-400">
                  <span className="flex items-center gap-2"><Mail size={12} />{event.organiserEmail}</span>
                  <span className="flex items-center gap-2"><Phone size={12} />{event.organiserPhone}</span>
                </div>
              </div>
            </div>
          </div>
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
                <span className="font-bold text-gray-900">{event.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Spots Left</span>
                <span className="font-bold text-gray-900">{event.spotsLeft}</span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-400">Access</span>
                <span className="font-bold text-gray-900">QR Code Ticket</span>
              </div>
            </div>

            {groupSent && (
              <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-xs font-medium text-emerald-700">
                ✓ QR passes sent to all group members!
              </div>
            )}

            <div className="mt-5 space-y-3">
              <button
                type="button"
                className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-700"
              >
                Register Now
              </button>
              <button
                type="button"
                className="w-full rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
              >
                Save Event
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

                  {groupError && (
                    <p className="text-xs text-red-500">{groupError}</p>
                  )}

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
                <li>Registration closes once spots are filled.</li>
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