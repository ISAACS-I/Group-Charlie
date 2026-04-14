import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Bookmark, BookmarkX } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

interface SavedEvent {
  id: string;
  eventTitle: string;
  category: string;
  date: string;
  location: string;
  description: string;
  imageBg: string;
  price: string;
}

const mockSavedEvents: SavedEvent[] = [
  {
    id: "1",
    eventTitle: "Creative Tech Summit 2026",
    category: "Technology",
    date: "May 15, 2026",
    location: "Botswana Innovation Hub",
    description: "Join innovators, creators, and entrepreneurs for a full day of talks, networking, and inspiration.",
    imageBg: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    price: "Free",
  },
  {
    id: "2",
    eventTitle: "Lekompo Summer Music Festival",
    category: "Music",
    date: "November 15-17, 2026",
    location: "Serowe",
    description: "Three days of incredible live performances from top lekompo artists.",
    imageBg: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
    price: "P150",
  },
  {
    id: "3",
    eventTitle: "Gourmet Cooking Workshop",
    category: "Food & Drink",
    date: "July 5, 2026",
    location: "Cresta Hotel and Restaurant",
    description: "Learn professional cooking techniques from Chef Seeletso in hands-on sessions.",
    imageBg: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    price: "P200",
  },
  {
    id: "4",
    eventTitle: "Contemporary Art Exhibition",
    category: "Arts & Culture",
    date: "March 28, 2026",
    location: "Thapong Cafe & Deli",
    description: "Experience the finest contemporary art from emerging and established local artists.",
    imageBg: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    price: "Free",
  },
];

export default function SavedEvents() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState<SavedEvent[]>(mockSavedEvents);
  const [search, setSearch] = useState("");

  const filtered = saved.filter((e) =>
    e.eventTitle.toLowerCase().includes(search.toLowerCase()) ||
    e.category.toLowerCase().includes(search.toLowerCase()) ||
    e.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleUnsave = (id: string) => {
    setSaved((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <DashboardLayout
      title="Saved Events"
      subtitle="Events you've bookmarked and want to attend."
      showSponsor
    >
      {/* Search */}
      <section className="mb-5 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            placeholder="Search saved events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button
            type="button"
            onClick={() => navigate("/browse-events")}
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            <Bookmark size={15} />
            Browse More
          </button>
        </div>
      </section>

      {/* Count */}
      <p className="mb-4 text-sm text-gray-400">
        {filtered.length} saved {filtered.length === 1 ? "event" : "events"}
      </p>

      {/* Events */}
      {filtered.length > 0 ? (
        <section className="space-y-4">
          {filtered.map((event) => (
            <div
              key={event.id}
              className="flex flex-col sm:flex-row overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Image */}
              <div
                className="h-32 w-full sm:h-auto sm:w-36 flex-shrink-0"
                style={{ background: event.imageBg }}
              />

              {/* Content */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{event.eventTitle}</h3>
                  <p className="mt-1 text-xs text-gray-400 leading-relaxed line-clamp-2">{event.description}</p>
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                      <Calendar size={12} /> {event.date}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-gray-400">
                      <MapPin size={12} /> {event.location}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-bold text-gray-900">{event.price}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUnsave(event.id)}
                      className="flex items-center gap-1.5 rounded-xl border border-red-100 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-50"
                    >
                      <BookmarkX size={13} />
                      Unsave
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate(`/browse-events/${event.id}`)}
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
          <p className="text-base font-medium text-gray-600">No saved events</p>
          <p className="mt-1 text-sm text-gray-400">
            {search ? "Try a different search term." : "Browse events and save ones you're interested in."}
          </p>
          {!search && (
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