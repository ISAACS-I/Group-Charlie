import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, QrCode } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

type BookingStatus = "Upcoming" | "Past" | "Cancelled";

interface Booking {
    id: string;
    eventTitle: string;
    category: string;
    date: string;
    time: string;
    location: string;
    status: BookingStatus;
    imageBg: string;
    price: string;
    cancelledByOrganiser?: boolean;
}

const mockBookings: Booking[] = [
    {
        id: "1",
        eventTitle: "Developer Meetup",
        category: "Technology",
        date: "March 28, 2026",
        time: "5:00 PM - 8:00 PM",
        location: "Innovation Hub",
        status: "Upcoming",
        imageBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        price: "Free",
    },
    {
        id: "2",
        eventTitle: "Women in Business Forum",
        category: "Business",
        date: "April 2, 2026",
        time: "10:00 AM - 2:00 PM",
        location: "Masa Square",
        status: "Upcoming",
        imageBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        price: "P50",
    },
    {
        id: "3",
        eventTitle: "Live Music Night",
        category: "Music",
        date: "March 30, 2026",
        time: "7:00 PM - 10:00 PM",
        location: "Gaborone Club",
        status: "Past",
        imageBg: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        price: "P80",
    },
    {
        id: "4",
        eventTitle: "FNB Kazungula Bridge Marathon",
        category: "Sports",
        date: "April 10, 2026",
        time: "6:00 AM - 12:00 PM",
        location: "Kazungula Bridge",
        status: "Cancelled",
        imageBg: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
        price: "P120",
    },
    {
        id: "5",
        eventTitle: "Gourmet Cooking Workshop",
        category: "Food & Drink",
        date: "July 5, 2026",
        time: "3:00 PM - 7:00 PM",
        location: "Cresta Hotel",
        status: "Cancelled",
        imageBg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
        price: "P200",
        cancelledByOrganiser: true,
    },
];

const statusStyles: Record<BookingStatus, string> = {
    Upcoming: "bg-emerald-50 text-emerald-700",
    Past: "bg-gray-100 text-gray-500",
    Cancelled: "bg-red-50 text-red-600",
};

const tabs: BookingStatus[] = ["Upcoming", "Past", "Cancelled"];

export default function MyBookings() {
    const [activeTab, setActiveTab] = useState<BookingStatus>("Upcoming");
    const navigate = useNavigate();

    const filtered = mockBookings.filter((b) => b.status === activeTab);

    return (
        <DashboardLayout
            title="My Bookings"
            subtitle="View and manage all your event registrations."
            showSponsor
        >
            {/* Tabs */}
            <section className="mb-5 flex flex-wrap gap-3">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        type="button"
                        onClick={() => setActiveTab(tab)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab
                                ? "bg-indigo-600 text-white"
                                : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        {tab} ({mockBookings.filter((b) => b.status === tab).length})
                    </button>
                ))}
            </section>

            {/* Bookings */}
            {filtered.length > 0 ? (
                <section className="space-y-4">
                    {filtered.map((booking) => (
                        <div
                            key={booking.id}
                            className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
                        >
                            {/* Image */}
                            <div
                                className="h-32 w-full sm:h-auto sm:w-36 flex-shrink-0"
                                style={{ background: booking.imageBg }}
                            />

                            {/* Content */}
                            <div className="flex flex-1 flex-col justify-between p-5">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                                            {booking.category}
                                        </span>
                                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[booking.status]}`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <h3 className={`text-base font-bold ${booking.cancelledByOrganiser ? "line-through text-gray-400" : "text-gray-900"}`}>
                                        {booking.eventTitle}
                                    </h3>
                                    {booking.cancelledByOrganiser && (
                                        <p className="text-xs font-medium text-orange-500 mt-0.5">
                                            Event cancelled by organiser — may be reinstated
                                        </p>
                                    )}
                                    <div className="mt-2 space-y-1">
                                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <Calendar size={12} /> {booking.date}
                                        </p>
                                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <Clock size={12} /> {booking.time}
                                        </p>
                                        <p className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <MapPin size={12} /> {booking.location}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                                    <span className="text-sm font-bold text-gray-900">{booking.price}</span>
                                    <div className="flex gap-2">
                                        {booking.status === "Upcoming" && (
                                            <button
                                                type="button"
                                                onClick={() => navigate("/settings")}
                                                className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-600 transition-colors hover:bg-indigo-100"
                                            >
                                                <QrCode size={13} />
                                                View QR Pass
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/browse-events/${booking.id}`)}
                                            className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-700"
                                        >
                                            View Event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </section>
            ) : (
                <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
                    <p className="text-base font-medium text-gray-600">No {activeTab.toLowerCase()} bookings</p>
                    <p className="mt-1 text-sm text-gray-400">
                        {activeTab === "Upcoming"
                            ? "Browse events and register to see your bookings here."
                            : `You have no ${activeTab.toLowerCase()} bookings.`}
                    </p>
                    {activeTab === "Upcoming" && (
                        <button
                            type="button"
                            onClick={() => navigate("/browse-events")}
                            className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                        >
                            Browse Events
                        </button>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}