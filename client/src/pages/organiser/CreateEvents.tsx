import DashboardLayout from "../../components/layout/DashboardLayout";
import { useState } from "react";

export default function CreateEventPage() {
  const [form, setForm] = useState({
    name: "",
    type: "Conference",
    description: "",
    date: "",
    time: "",
    duration: "2",
    location: "",
    attendees: "100",
    price: "0.00",
    category: "Technology",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <DashboardLayout
      title="Create Event"
      subtitle="Fill in the details below to create and publish your next event."
      showSponsor
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Event Details</h2>
          <p className="text-sm text-gray-400 mb-4">Fill in the basic information about your event.</p>

          {/* Upload */}
          <div className="border-2 border-dashed border-gray-200 rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 mb-6">
            <div className="text-sm font-medium">Upload Cover Image</div>
            <p className="text-xs">Choose a clear event image or banner.</p>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="name"
              placeholder="Event Name"
              value={form.name}
              onChange={handleChange}
              className="input"
            />

            <input
              name="type"
              value={form.type}
              onChange={handleChange}
              className="input"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              className="input col-span-1 sm:col-span-2 h-24"
            />

            <input name="date" type="date" value={form.date} onChange={handleChange} className="input" />
            <input name="time" type="time" value={form.time} onChange={handleChange} className="input" />

            <input name="duration" value={form.duration} onChange={handleChange} className="input" placeholder="Duration (hrs)" />
            <input name="attendees" value={form.attendees} onChange={handleChange} className="input" placeholder="Max Attendees" />

            <input name="location" value={form.location} onChange={handleChange} className="input col-span-1 sm:col-span-2" placeholder="Location" />

            <input name="price" value={form.price} onChange={handleChange} className="input" placeholder="Ticket Price" />
            <input name="category" value={form.category} onChange={handleChange} className="input" placeholder="Category" />
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl">
              Save as Draft
            </button>
            <button className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl hover:bg-indigo-700">
              Create Event
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50">
                Duplicate Last Event
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50">
                Import Event Template
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50">
                Invite Team Members
              </button>
            </div>
          </div>

          {/* Recent Events */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Events</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium">Tech Conference 2024</p>
                <p className="text-gray-400 text-xs">March 15, 2024</p>
              </div>
              <div>
                <p className="font-medium">Design Workshop</p>
                <p className="text-gray-400 text-xs">March 10, 2024</p>
              </div>
              <div>
                <p className="font-medium">Marketing Webinar</p>
                <p className="text-gray-400 text-xs">March 5, 2024</p>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Event Tips</h3>
            <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
              <li>Use a clear and specific title.</li>
              <li>Add the correct venue or online link.</li>
              <li>Keep the description short and useful.</li>
            </ul>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Tailwind helper (optional)
// Add this in your global CSS if you want cleaner inputs
// .input {
//   @apply w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500;
// }
