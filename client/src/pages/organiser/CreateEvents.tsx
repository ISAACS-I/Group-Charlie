import { useState } from "react";
import { Upload, ImagePlus, MapPin } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";

export default function CreateEvent() {
  const [form, setForm] = useState({
    name: "",
    type: "Conference",
    description: "",
    hasAgeRestriction: false,
    minAge: "",
    date: "",
    time: "",
    duration: "2",
    location: "",
    directions: "",
    attendees: "100",
    price: "0.00",
    category: "Technology",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: checked,
      ...(name === "hasAgeRestriction" && !checked ? { minAge: "" } : {}),
    }));
  };

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all";

  return (
    <DashboardLayout
      title="Create Event"
      subtitle="Fill in the details below to create and publish your next event."
      showSponsor
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Form */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-gray-900 mb-1">Event Details</h2>
          <p className="text-sm text-gray-400 mb-5">Fill in the basic information about your event.</p>

          {/* Cover Image */}
          <div className="mb-4 space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Cover Image
            </label>
            <div className="flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors gap-2">
              <Upload size={24} className="text-gray-300" />
              <p className="text-sm font-medium">Upload Cover Image</p>
              <p className="text-xs">Used as the hero banner at the top of your event page.</p>
            </div>
          </div>

          {/* Event Photos */}
          <div className="mb-6 space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Event Photos
            </label>
            <p className="text-xs text-gray-400 mb-1">Add multiple photos to showcase your event. These will appear in a gallery on your event page.</p>
            <div className="flex h-40 flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors gap-2">
              <ImagePlus size={24} className="text-gray-300" />
              <p className="text-sm font-medium">Upload Event Photos</p>
              <p className="text-xs">You can upload multiple photos.</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Name</label>
              <input
                name="name"
                placeholder="e.g. Developer Meetup 2026"
                value={form.name}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Type</label>
              <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                <option>Conference</option>
                <option>Workshop</option>
                <option>Meetup</option>
                <option>Webinar</option>
                <option>Festival</option>
                <option>Other</option>
              </select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</label>
              <textarea
                name="description"
                placeholder="Describe your event..."
                value={form.description}
                onChange={handleChange}
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</label>
              <input name="date" type="date" value={form.date} onChange={handleChange} className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</label>
              <input name="time" type="time" value={form.time} onChange={handleChange} className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration (hrs)</label>
              <input name="duration" value={form.duration} onChange={handleChange} placeholder="e.g. 2" className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Max Attendees</label>
              <input name="attendees" value={form.attendees} onChange={handleChange} placeholder="e.g. 100" className={inputClass} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
              <div className="flex gap-2">
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Innovation Hub, Gaborone"
                  className={`${inputClass} flex-1`}
                />
                {form.location.trim() !== "" && (
                  <a
                    href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(form.location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-indigo-600 whitespace-nowrap"
                  >
                    <MapPin size={14} />
                    View on Maps
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Directions
              </label>
              <textarea
                name="directions"
                placeholder="e.g. From the main road, turn left at the BP garage. We are the second building on the right."
                value={form.directions}
                onChange={handleChange}
                rows={3}
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ticket Price (P)</label>
              <input name="price" value={form.price} onChange={handleChange} placeholder="0.00" className={inputClass} />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                <option>Technology</option>
                <option>Business</option>
                <option>Music</option>
                <option>Sports</option>
                <option>Arts & Culture</option>
                <option>Food & Drink</option>
                <option>Community</option>
                <option>Other</option>
              </select>
            </div>

            {/* Age Restriction */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Age Restriction
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="hasAgeRestriction"
                  checked={form.hasAgeRestriction}
                  onChange={handleCheckbox}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-sm text-gray-600">This event has an age restriction</span>
              </label>

              {form.hasAgeRestriction && (
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="number"
                    name="minAge"
                    value={form.minAge}
                    onChange={handleChange}
                    placeholder="e.g. 18"
                    min="1"
                    max="100"
                    className={`${inputClass} w-32`}
                  />
                  <span className="text-sm text-gray-500">years and older</span>
                </div>
              )}
            </div>

          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-200"
            >
              Save as Draft
            </button>
            <button
              type="button"
              className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Create Event
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {["Duplicate Last Event", "Import Event Template", "Invite Team Members"].map(label => (
                <button
                  key={label}
                  type="button"
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">Recent Events</h3>
            <div className="space-y-3">
              {[
                { title: "Tech Conference 2024", date: "March 15, 2024" },
                { title: "Design Workshop", date: "March 10, 2024" },
                { title: "Marketing Webinar", date: "March 5, 2024" },
              ].map(event => (
                <div key={event.title}>
                  <p className="text-sm font-medium text-gray-900">{event.title}</p>
                  <p className="text-xs text-gray-400">{event.date}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">Event Tips</h3>
            <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
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