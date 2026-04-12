import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

// ===================== TYPES =====================

// These are the allowed event statuses shown in the tab filters.
// Using a union type helps TypeScript catch mistakes.
type EventStatus = "Upcoming" | "Past Events" | "Drafts" | "Cancelled";

// This interface defines the shape of one event card.
// Every event object in the page must follow this structure.
interface MyEventItem {
  id: number; // unique identifier for React rendering
  title: string; // event title
  category: string; // type of event such as Conference or Webinar
  date: string; // event date and time
  location: string; // venue or platform
  attendees: number; // number of attendees
  status: EventStatus; // current event state
  imageBg?: string; // optional custom background for top image area
}

// ===================== MOCK DATA =====================

// Temporary data used to design the page.
// In a real application this would come from an API or database.
const myEventsData: MyEventItem[] = [
  {
    id: 1,
    title: "Tech Summit 2024",
    category: "Conference",
    date: "Mar 25, 2024 • 9:00 AM",
    location: "San Francisco Convention Center",
    attendees: 245,
    status: "Upcoming",
    imageBg: "linear-gradient(135deg, #c7d2fe, #ddd6fe)",
  },
  {
    id: 2,
    title: "UX Design Masterclass",
    category: "Workshop",
    date: "Apr 2, 2024 • 2:00 PM",
    location: "Creative Hub Downtown",
    attendees: 48,
    status: "Upcoming",
    imageBg: "linear-gradient(135deg, #c7d2fe, #ddd6fe)",
  },
  {
    id: 3,
    title: "Startup Networking Night",
    category: "Meetup",
    date: "Apr 10, 2024 • 6:30 PM",
    location: "The Innovation Lab",
    attendees: 87,
    status: "Upcoming",
    imageBg: "linear-gradient(135deg, #c7d2fe, #ddd6fe)",
  },
  {
    id: 4,
    title: "Digital Marketing Trends",
    category: "Webinar",
    date: "Apr 18, 2024 • 11:00 AM",
    location: "Online Event",
    attendees: 312,
    status: "Upcoming",
    imageBg: "linear-gradient(135deg, #c7d2fe, #ddd6fe)",
  },
  {
    id: 5,
    title: "Business Growth Forum",
    category: "Conference",
    date: "Jan 11, 2024 • 10:00 AM",
    location: "Grand Hall",
    attendees: 190,
    status: "Past Events",
    imageBg: "linear-gradient(135deg, #e5e7eb, #d1d5db)",
  },
  {
    id: 6,
    title: "Design Sprint Bootcamp",
    category: "Workshop",
    date: "May 5, 2024 • 1:00 PM",
    location: "Studio 24",
    attendees: 0,
    status: "Drafts",
    imageBg: "linear-gradient(135deg, #ede9fe, #ddd6fe)",
  },
  {
    id: 7,
    title: "Investor Mixer",
    category: "Meetup",
    date: "Feb 9, 2024 • 7:00 PM",
    location: "Sky Lounge",
    attendees: 0,
    status: "Cancelled",
    imageBg: "linear-gradient(135deg, #fee2e2, #fecaca)",
  },
];

// ===================== SMALL UI HELPERS =====================

// This small reusable component is used for the tabs at the top.
// It changes appearance depending on whether the tab is active.
function StatusTab({
  label,
  count,
  active,
  onClick,
}: {
  label: EventStatus;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${active
          ? "bg-indigo-600 text-white"
          : "bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-900"
        }`}
    >
      {label} ({count})
    </button>
  );
}

// This component displays one event card.
// It matches the card layout shown in the screenshot.
function MyEventCard({
  event,
  onManage
}: {
  event: MyEventItem;
  onManage?: (event: MyEventItem) => void;
  onEdit?: (event: MyEventItem) => void;
  onDelete?: (event: MyEventItem) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Top decorative image/banner area */}
      <div
        className="h-36 w-full"
        style={{
          background:
            event.imageBg ?? "linear-gradient(135deg, #c7d2fe, #ddd6fe)",
        }}
      />

      {/* Content section */}
      <div className="p-4">
        {/* Top row with category*/}
        <div className="mb-3 flex items-start justify-between gap-3">
          <p className="text-sm text-gray-500">{event.category}</p>
          </div>

        {/* Main event details */}
        <h3 className="text-base font-semibold leading-tight text-gray-900">
          {event.title}
        </h3>

        <p className="mt-1 text-sm text-gray-400">{event.date}</p>
        <p className="mt-1 text-sm text-gray-400">{event.location}</p>

        {/* Bottom row with attendee count and manage button */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-700">
            {event.attendees} attendees
          </p>

          <button
            type="button"
            onClick={() => onManage?.(event)}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Manage Event
          </button>
        </div>
      </div>
    </div>
  );
}

// ===================== PAGE COMPONENT =====================

export default function MyEventsPage() {
  // This stores the currently selected status tab.
  // The page starts by showing "Upcoming" events.
  const [activeTab, setActiveTab] = useState<EventStatus>("Upcoming");

  const navigate = useNavigate();

  // This stores the text the user types into the search field.
  const [searchTerm, setSearchTerm] = useState("");

  // This stores the selected category filter.
  // "All Categories" means no category filter is applied.
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // This stores the selected sort option.
  // For now this controls only simple front-end sorting.
  const [sortOption, setSortOption] = useState("Sort by Date");

  // This creates a unique list of categories from the event data.
  // Set is used to remove duplicates.
  const categoryOptions = useMemo(() => {
    const uniqueCategories = new Set(myEventsData.map((event) => event.category));
    return ["All Categories", ...Array.from(uniqueCategories)];
  }, []);

  // This object calculates how many events belong to each status.
  // These counts are used inside the tab buttons.
  const tabCounts = useMemo(() => {
    return {
      Upcoming: myEventsData.filter((event) => event.status === "Upcoming").length,
      "Past Events": myEventsData.filter((event) => event.status === "Past Events").length,
      Drafts: myEventsData.filter((event) => event.status === "Drafts").length,
      Cancelled: myEventsData.filter((event) => event.status === "Cancelled").length,
    };
  }, []);

  // This computes the list of events that should be displayed.
  // Filtering is based on:
  // 1. active tab
  // 2. search text
  // 3. selected category
  // Then sorting is applied.
  const filteredEvents = useMemo(() => {
    let result = myEventsData.filter((event) => {
      const matchesTab = event.status === activeTab;

      const matchesSearch =
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        event.category === selectedCategory;

      return matchesTab && matchesSearch && matchesCategory;
    });

    // Simple front-end sorting example.
    // Since the dates are sample strings, this is mostly illustrative.
    if (sortOption === "Sort by Attendance") {
      result = [...result].sort((a, b) => b.attendees - a.attendees);
    } else {
      result = [...result].sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [activeTab, searchTerm, selectedCategory, sortOption]);

  // These handler functions are placeholders for future logic.
  // Right now they just show where actions would be added later.
  const handleManageEvent = (event: MyEventItem) => {
    navigate(`/my-events/${event.id}`);
  };

  const handleEditEvent = (event: MyEventItem) => {
    console.log("Edit event:", event.title);
  };

  const handleDeleteEvent = (event: MyEventItem) => {
    console.log("Delete event:", event.title);
  };

  return (
    <DashboardLayout
      title="My Events"
      subtitle="Manage, monitor, and update all your created events in one place."
      showSponsor
    >
      <div className="space-y-5">
        {/* ===================== STATUS TABS ===================== */}
        <section className="flex flex-wrap gap-3">
          <StatusTab
            label="Upcoming"
            count={tabCounts.Upcoming}
            active={activeTab === "Upcoming"}
            onClick={() => setActiveTab("Upcoming")}
          />

          <StatusTab
            label="Past Events"
            count={tabCounts["Past Events"]}
            active={activeTab === "Past Events"}
            onClick={() => setActiveTab("Past Events")}
          />

          <StatusTab
            label="Drafts"
            count={tabCounts.Drafts}
            active={activeTab === "Drafts"}
            onClick={() => setActiveTab("Drafts")}
          />

          <StatusTab
            label="Cancelled"
            count={tabCounts.Cancelled}
            active={activeTab === "Cancelled"}
            onClick={() => setActiveTab("Cancelled")}
          />
        </section>

        {/* ===================== SEARCH ===================== */}
        <section className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-500"
            />

            {/* This button visually matches the design.
                Filtering already happens live as the user types. */}
            <button
              type="button"
              className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </section>

        {/* ===================== FILTERS ===================== */}
        <section className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-indigo-500"
          >
            {categoryOptions.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 outline-none transition focus:border-indigo-500"
          >
            <option value="Sort by Date">Sort by Date</option>
            <option value="Sort by Attendance">Sort by Attendance</option>
          </select>
        </section>

        {/* ===================== EVENT GRID ===================== */}
        <section>
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
              {filteredEvents.map((event) => (
                <MyEventCard
                  key={event.id}
                  event={event}
                  onManage={handleManageEvent}
                  onEdit={handleEditEvent}
                  onDelete={handleDeleteEvent}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900">
                No events found
              </h3>
              <p className="mt-2 text-sm text-gray-400">
                Try changing the tab, search term, or filters.
              </p>
            </div>
          )}
        </section>
      </div>
    </DashboardLayout>
  );
}