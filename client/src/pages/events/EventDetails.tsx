import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Wallet, 
  Mail, 
  Phone, 
  Menu 
} from 'lucide-react';

const EventDetailsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* --- Navbar --- */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white border-b">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold">Event Details</h1>
            <p className="text-xs text-gray-500">Learn more about this event and complete your registration.</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-2 border rounded-md text-sm font-medium text-gray-400">Logo</div>
          <button className="px-6 py-2 border rounded-md text-sm font-medium hover:bg-gray-50">
            Sponsors / Partners
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        
        {/* --- Hero Banner --- */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8 md:p-12 text-white">
          <div className="relative z-10">
            <span className="text-xs font-semibold uppercase tracking-wider opacity-80">Culture • Food • Music</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-4">Dithubaruba</h2>
            <p className="text-lg opacity-90 max-w-2xl mb-8">
              Experience culture, music, food, and tradition in one unforgettable celebration.
            </p>
            
            <div className="flex gap-4">
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                <p className="text-[10px] uppercase opacity-80">Registration</p>
                <p className="font-semibold text-sm">QR Access Included</p>
              </div>
              <div className="bg-white/20 backdrop-blur-md rounded-xl p-3 border border-white/30">
                <p className="text-[10px] uppercase opacity-80">Available Spots</p>
                <p className="font-semibold text-sm">247 / 500 Left</p>
              </div>
            </div>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Content) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Visual Placeholder */}
            <div className="w-full h-64 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl shadow-lg"></div>

            {/* About Section */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">About This Event</h3>
              <p className="text-gray-600 leading-relaxed">
                Dithubaruba is a vibrant cultural gathering that celebrates traditional dance, 
                local music, food, and community spirit. Guests can enjoy live performances, 
                cultural showcases, and interactive activities throughout the day.
              </p>
            </section>

            {/* Event Information Grid */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Event Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                <InfoItem icon={<Calendar size={18}/>} label="Date" value="March 25, 2026" />
                <InfoItem icon={<Clock size={18}/>} label="Time" value="9:00 AM - 6:00 PM" />
                <InfoItem icon={<MapPin size={18}/>} label="Venue" value="Molepolole Stadium" />
                <InfoItem icon={<Users size={18}/>} label="Available Spots" value="247 / 500" />
                <InfoItem icon={<Tag size={18}/>} label="Category" value="Culture, Food, Music" />
                <InfoItem icon={<Wallet size={18}/>} label="Entry Fee" value="P50" />
              </div>
            </section>

            {/* Organiser Details */}
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-6">Organiser Details</h3>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">O</div>
                <div>
                  <h4 className="font-bold">EventHub Cultural Team</h4>
                  <div className="flex flex-col gap-1 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-2"><Mail size={14}/> culture@eventhub.com</span>
                    <span className="flex items-center gap-2"><Phone size={14}/> +267 70000000</span>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column (Registration Sidebar) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 sticky top-6">
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-md uppercase">Open Registration</span>
              <h3 className="text-xl font-bold mt-3">Register for this Event</h3>
              <p className="text-sm text-gray-500 mt-1">Complete your booking and receive a unique QR code for entry.</p>
              
              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Fee</span>
                  <span className="font-bold">free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Spots Left</span>
                  <span className="font-bold text-gray-900">247</span>
                </div>
                <div className="flex justify-between border-b pb-4">
                  <span className="text-gray-500">Access</span>
                  <span className="font-bold">QR Code Ticket</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl hover:bg-indigo-700 transition">
                  Register Now
                </button>
                <button className="w-full bg-gray-100 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-200 transition">
                  Save Event
                </button>
              </div>

              <div className="mt-8">
                <h4 className="font-bold text-sm mb-3">Registration Notes</h4>
                <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                  <li>Bring your QR code on event day.</li>
                  <li>Registration closes once spots are filled.</li>
                  <li>Refund policy may depend on organiser rules.</li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* --- Footer --- */}
      <footer className="max-w-7xl mx-auto px-6 py-10 mt-12 border-t flex flex-col md:flex-row justify-between items-center text-xs text-gray-400 gap-4">
        <div className="flex gap-6">
          <a href="#" className="hover:text-gray-600">Browse Events</a>
          <a href="#" className="hover:text-gray-600">Contact</a>
          <a href="#" className="hover:text-gray-600">Policies</a>
          <a href="#" className="hover:text-gray-600">Terms of Use</a>
        </div>
        <p>© 2026 EventHub. All rights reserved.</p>
      </footer>
    </div>
  );
};

// Helper component for the Info Grid
interface InfoItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ icon, label, value }) => (
  <div className="space-y-1">
    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{label}</p>
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <span className="font-bold text-gray-800">{value}</span>
    </div>
  </div>
);

export default EventDetailsPage;
