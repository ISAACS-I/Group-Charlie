import { useState, useCallback, useRef } from "react";
import { MapPin, Upload, X, Image as ImageIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";

const API_BASE = "http://localhost:5001/api";

function getToken(): string {
  try {
    const stored = localStorage.getItem("authUser");
    return stored ? JSON.parse(stored).token : "";
  } catch { return ""; }
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 placeholder:text-gray-300 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all";

export default function CreateEvent() {
  const navigate = useNavigate();
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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

  // Image states
  const [thumbnail, setThumbnail] = useState<{ file: File; preview: string } | null>(null);
  const [banner, setBanner] = useState<{ file: File; preview: string } | null>(null);
  const [gallery, setGallery] = useState<Array<{ file: File; preview: string }>>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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

  // Handle thumbnail upload
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Thumbnail image must be less than 5MB");
        return;
      }
      const preview = URL.createObjectURL(file);
      setThumbnail({ file, preview });
    }
  };

  // Handle banner upload
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Banner image must be less than 10MB");
        return;
      }
      const preview = URL.createObjectURL(file);
      setBanner({ file, preview });
    }
  };

  // Handle gallery uploads
  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError("Gallery images must be less than 5MB each");
        return null;
      }
      return {
        file,
        preview: URL.createObjectURL(file)
      };
    }).filter((img): img is { file: File; preview: string } => img !== null);

    setGallery(prev => [...prev, ...newImages]);
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    setGallery(prev => {
      const newGallery = [...prev];
      URL.revokeObjectURL(newGallery[index].preview);
      newGallery.splice(index, 1);
      return newGallery;
    });
  };

  // Cleanup object URLs
  const cleanupImages = () => {
    if (thumbnail) URL.revokeObjectURL(thumbnail.preview);
    if (banner) URL.revokeObjectURL(banner.preview);
    gallery.forEach(img => URL.revokeObjectURL(img.preview));
  };

  const validateForm = (): boolean => {
    if (!form.name.trim()) {
      setError("Event name is required.");
      return false;
    }
    if (!form.date) {
      setError("Event date is required.");
      return false;
    }
    if (!form.location.trim()) {
      setError("Event location is required.");
      return false;
    }
    if (form.hasAgeRestriction && (!form.minAge || parseInt(form.minAge) < 1)) {
      setError("Valid minimum age is required when age restriction is enabled.");
      return false;
    }
    if (!thumbnail) {
      setError("Event thumbnail is required.");
      return false;
    }
    if (!banner) {
      setError("Event banner is required.");
      return false;
    }
    const capacity = parseInt(form.attendees);
    if (isNaN(capacity) || capacity < 1) {
      setError("Valid attendee capacity is required.");
      return false;
    }
    return true;
  };

  const uploadImage = async (file: File, type: 'thumbnail' | 'banner' | 'gallery'): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);
    // ← type is now a query param, not a form field
    const res = await fetch(`${API_BASE}/upload?type=${type}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to upload image');
    return data.url;
  };

  const submitEvent = useCallback(async (status: "Draft" | "Active" | "Upcoming") => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Upload all images first
      const thumbnailUrl = await uploadImage(thumbnail!.file, 'thumbnail');
      const bannerUrl = await uploadImage(banner!.file, 'banner');

      const galleryUrls = await Promise.all(
        gallery.map(img => uploadImage(img.file, 'gallery'))
      );

      // Create event with image URLs
      const res = await fetch(`${API_BASE}/events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          title: form.name,
          description: form.description || undefined,
          category: form.category,
          type: form.type,
          date: form.date,
          time: form.time || undefined,
          duration: parseInt(form.duration) || 2,
          location: form.location,
          directions: form.directions || undefined,
          price: parseFloat(form.price) || 0,
          capacity: parseInt(form.attendees) || 100,
          hasAgeRestriction: form.hasAgeRestriction,
          minAge: form.hasAgeRestriction ? parseInt(form.minAge) || 18 : undefined,
          thumbnail: thumbnailUrl,
          banner: bannerUrl,
          gallery: galleryUrls,
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        return setError(data.message || data.error || "Failed to create event");
      }

      const eventId = data.event?._id || data._id;

      cleanupImages(); // Clean up preview URLs

      setSuccess(
        status === "Draft"
          ? "Event saved as draft!"
          : "Event created and published!"
      );

      setTimeout(() => {
        if (eventId) {
          navigate(`/my-events/${eventId}`);
        } else {
          navigate('/my-events');
        }
      }, 1500);
    } catch (err) {
      setError("Could not connect to server. Please try again.");
      console.error("Create event error:", err);
    } finally {
      setIsSubmitting(false);
    }
  }, [form, navigate, thumbnail, banner, gallery]);

  return (
    <DashboardLayout
      title="Create Event"
      subtitle="Fill in the details below to create and publish your next event."
      showSponsor
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">

          {/* Event Images Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-1">Event Images</h2>
            <p className="text-sm text-gray-400 mb-5">Add visuals to make your event stand out</p>

            {/* Thumbnail Upload */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Event Thumbnail * <span className="text-gray-400 font-normal">(displayed in event cards)</span>
              </label>
              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                onChange={handleThumbnailUpload}
                className="hidden"
              />
              {thumbnail ? (
                <div className="relative w-48 h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={thumbnail.preview} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(thumbnail.preview);
                      setThumbnail(null);
                      if (thumbnailInputRef.current) thumbnailInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Thumbnail</span>
                  <span className="text-xs text-gray-400">Max 5MB</span>
                </button>
              )}
              <p className="text-xs text-gray-400 mt-2">Recommended: 400x400px square image</p>
            </div>

            {/* Banner Upload */}
            <div className="mb-6">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Event Banner * <span className="text-gray-400 font-normal">(hero image for event page)</span>
              </label>
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                onChange={handleBannerUpload}
                className="hidden"
              />
              {banner ? (
                <div className="relative w-full h-48 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img src={banner.preview} alt="Banner preview" className="w-full h-full object-cover" />
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(banner.preview);
                      setBanner(null);
                      if (bannerInputRef.current) bannerInputRef.current.value = '';
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => bannerInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <Upload size={24} className="text-gray-400" />
                  <span className="text-sm text-gray-500">Upload Banner</span>
                  <span className="text-xs text-gray-400">Max 10MB</span>
                </button>
              )}
              <p className="text-xs text-gray-400 mt-2">Recommended: 1200x400px landscape image</p>
            </div>

            {/* Gallery Upload */}
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
                Event Gallery <span className="text-gray-400 font-normal">(additional photos of venue, past events, etc.)</span>
              </label>
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />

              <div className="grid grid-cols-4 gap-3">
                {gallery.map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200">
                    <img src={img.preview} alt={`Gallery ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeGalleryImage(index)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => galleryInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
                >
                  <ImageIcon size={20} className="text-gray-400" />
                  <span className="text-xs text-gray-500">Add Photo</span>
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">Add up to 10 photos. Max 5MB each</p>
            </div>
          </div>

          {/* Event Details Form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="text-base font-bold text-gray-900 mb-1">Event Details</h2>
            <p className="text-sm text-gray-400 mb-5">Fill in the basic information about your event.</p>

            {/* Success / Error */}
            {success && (
              <div className="mb-4 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                ✓ {success}
              </div>
            )}
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                ✕ {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Name *</label>
                <input
                  name="name"
                  placeholder="e.g. Developer Meetup 2026"
                  value={form.name}
                  onChange={handleChange}
                  className={inputClass}
                  required
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
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Date *</label>
                <input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleChange}
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Time</label>
                <input name="time" type="time" value={form.time} onChange={handleChange} className={inputClass} />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Duration (hrs)</label>
                <input
                  name="duration"
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="e.g. 2"
                  className={inputClass}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Max Attendees *</label>
                <input
                  name="attendees"
                  type="number"
                  min="1"
                  value={form.attendees}
                  onChange={handleChange}
                  placeholder="e.g. 100"
                  className={inputClass}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location *</label>
                <div className="flex gap-2">
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="e.g. Innovation Hub, Gaborone"
                    className={`${inputClass} flex-1`}
                    required
                  />
                  {form.location.trim() !== "" && (
                    <a
                      href={"https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(form.location)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 whitespace-nowrap"
                    >
                      <MapPin size={14} />
                      View on Maps
                    </a>
                  )}
                </div>
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Directions</label>
                <textarea
                  name="directions"
                  placeholder="e.g. From the main road, turn left at the BP garage..."
                  value={form.directions}
                  onChange={handleChange}
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Ticket Price (P)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className={inputClass}
                />
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
                  <option>Education</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Age Restriction */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Age Restriction</label>
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
                disabled={isSubmitting}
                onClick={() => submitEvent("Draft")}
                className="flex-1 rounded-xl bg-gray-100 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save as Draft"}
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => submitEvent("Upcoming")}
                className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">Image Guidelines</h3>
            <ul className="space-y-3 text-xs text-gray-500">
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                <span><strong className="text-gray-700">Thumbnail:</strong> Square image that appears in event cards and search results</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                <span><strong className="text-gray-700">Banner:</strong> Wide hero image displayed at the top of your event page</span>
              </li>
              <li className="flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5" />
                <span><strong className="text-gray-700">Gallery:</strong> Additional photos to showcase your venue, past events, or highlights</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">Quick Actions</h3>
            <div className="space-y-2">
              {["Duplicate Last Event", "Import Event Template", "Invite Team Members"].map(label => (
                <button
                  key={label}
                  type="button"
                  onClick={() => console.log(`Quick action: ${label}`)}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-gray-900 mb-3">Event Tips</h3>
            <ul className="space-y-2 text-xs text-gray-400 list-disc pl-4">
              <li>Use high-quality images to attract attendees</li>
              <li>Use a clear and specific title.</li>
              <li>Add the correct venue or online link.</li>
              <li>Keep the description short and useful.</li>
              <li>Set a realistic attendee capacity.</li>
              <li>Double-check your date and time before publishing.</li>
            </ul>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}