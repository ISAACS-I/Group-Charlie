import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

const CATEGORIES = [
  {
    name: "Technology",
    description: "Conferences, hackathons, developer meetups and innovation events.",
    count: 12,
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    name: "Business",
    description: "Networking nights, forums, entrepreneurship and leadership events.",
    count: 8,
    color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    name: "Music",
    description: "Live performances, festivals, acoustic sessions and concerts.",
    count: 15,
    color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    name: "Sports",
    description: "Marathons, tournaments, fitness events and outdoor activities.",
    count: 6,
    color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    name: "Arts & Culture",
    description: "Exhibitions, cultural gatherings, theatre and creative showcases.",
    count: 9,
    color: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  },
  {
    name: "Food & Drink",
    description: "Cooking workshops, food festivals, tastings and culinary events.",
    count: 5,
    color: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
  },
  {
    name: "Community",
    description: "Local meetups, charity drives, social impact and volunteer events.",
    count: 10,
    color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    name: "Education",
    description: "Workshops, seminars, training sessions and learning events.",
    count: 7,
    color: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
];

export default function Categories() {
  const navigate = useNavigate();

  const handleCategoryClick = (category: string) => {
    navigate(`/browse-events?category=${encodeURIComponent(category)}`);
  };

  return (
    <DashboardLayout
      title="Categories"
      subtitle="Browse events by category and find what interests you."
      showSponsor
    >
      {/* Hero */}
      <section className="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-8">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold text-white">Explore by Category</h2>
          <p className="mt-1 text-sm text-indigo-100">
            Find events that match your interests across {CATEGORIES.length} categories.
          </p>
        </div>
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="absolute -right-4 top-16 h-24 w-24 rounded-full bg-white/10" />
      </section>

      {/* Category Grid */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map((category) => (
          <button
            key={category.name}
            type="button"
            onClick={() => handleCategoryClick(category.name)}
            className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md text-left"
          >
            {/* Color Banner */}
            <div
              className="h-24 w-full"
              style={{ background: category.color }}
            />

            {/* Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-gray-900">{category.name}</h3>
                <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-600">
                  {category.count}
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">{category.description}</p>
            </div>
          </button>
        ))}
      </section>
    </DashboardLayout>
  );
}