import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Clock, MapPin, Users, Tag, Wallet, Mail, Phone } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hardcoded for now — will be replaced with API call using `id`
  const event = {
    id,
    category: "Culture • Food • Music",
    title: "Dithubaruba",
    description: "Experience culture, music, food, and tradition in one unforgettable celebration.",
    date: "March 25, 2026",
    time: "9:00 AM - 6:00 PM",
    location: "Molepolole Stadium",
    spotsLeft: 247,
    totalSpots: 500,
    price: "P50",
    imageBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    organiserName: "EventHub Cultural Team",
    organiserEmail: "culture@eventhub.com",
    organiserPhone: "+267 70000000",
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

          {/* Image */}
          <div
            className="w-full h-56 rounded-2xl shadow-sm"
            style={{ background: event.imageBg }}
          />

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
            </div>
          </div>

          {/* Organiser */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-4">Organiser Details</h3>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
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