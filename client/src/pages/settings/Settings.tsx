import { useState, useRef, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import {
  User, Lock, Bell, AlertTriangle, Save,
  Camera, Upload, X, QrCode, Download
} from "lucide-react";

const API = "http://localhost:5001/api/settings";

export default function Settings() {
  const { updateUser, signOut } = useAuth();

  // Pull token from the authUser object in localStorage
  const getToken = () => {
    try {
      const stored = localStorage.getItem("authUser");
      return stored ? JSON.parse(stored).token : "";
    } catch { return ""; }
  };

  const authHeaders = (isJson = true): HeadersInit => {
    const h: HeadersInit = { Authorization: `Bearer ${getToken()}` };
    if (isJson) h["Content-Type"] = "application/json";
    return h;
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    organization: "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    emailReminders: true,
    qrAlerts: true,
    marketingEmails: false,
    eventUpdates: true,
  });

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [qrCodeId, setQrCodeId] = useState<string | null>(null);
  const [scanHistory, setScanHistory] = useState<{ event: string; date: string; time: string; location: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setErrorMessage("");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const showError = (msg: string) => {
    setErrorMessage(msg);
    setSuccessMessage("");
    setTimeout(() => setErrorMessage(""), 4000);
  };

  // ─── Load profile on mount ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(API, { headers: authHeaders() });
        const data = await res.json();
        if (!res.ok) return showError(data.message ?? "Failed to load profile");

        setFormData({
          firstName:    data.firstName    ?? "",
          lastName:     data.lastName     ?? "",
          email:        data.email        ?? "",
          phone:        data.phone        ?? "",
          organization: data.organization ?? "",
        });

        if (data.notifications) setNotifications(data.notifications);
        if (data.profilePicture)
          setProfilePicture(`http://localhost:5001${data.profilePicture}`);
        if (data.scanHistory) setScanHistory(data.scanHistory);
      } catch {
        showError("Could not connect to server");
      }
    })();
  }, []);

  // ─── Load QR code on mount ───────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API}/qr-code`, {
          method: "POST",
          headers: authHeaders(),
        });
        const data = await res.json();
        if (res.ok) {
          setQrCodeImage(data.qrCodeImage);
          setQrCodeId(data.qrCodeId);
        }
      } catch { /* silently fail */ }
    })();
  }, []);

  // ─── Profile update ──────────────────────────────────────────────────────────
  const handleProfileSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/profile`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) return showError(data.message ?? "Update failed");

      // Sync name change into AuthContext + localStorage immediately
      updateUser({
        firstName: formData.firstName,
        lastName:  formData.lastName,
        email:     formData.email,
      });

      showSuccess("Profile updated successfully!");
    } catch {
      showError("Could not connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Password change ─────────────────────────────────────────────────────────
  const handlePasswordSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm)
      return showError("New passwords do not match");

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API}/password`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          current:     passwordData.current,
          newPassword: passwordData.new,
          confirm:     passwordData.confirm,
        }),
      });
      const data = await res.json();
      if (!res.ok) return showError(data.message ?? "Password update failed");
      showSuccess("Password updated successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
    } catch {
      showError("Could not connect to server");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── Profile picture ─────────────────────────────────────────────────────────
  const uploadPicture = async (file: File) => {
    const formPayload = new FormData();
    formPayload.append("profilePicture", file);
    try {
      const res = await fetch(`${API}/profile-picture`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formPayload,
      });
      const data = await res.json();
      if (!res.ok) return showError(data.message ?? "Upload failed");
      setProfilePicture(`http://localhost:5001${data.profilePicture}`);
      showSuccess("Profile picture updated!");
    } catch {
      showError("Could not connect to server");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadPicture(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file?.type.startsWith("image/")) uploadPicture(file);
  };

  const removeProfilePicture = async () => {
    try {
      const res = await fetch(`${API}/profile-picture`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) return showError("Failed to remove picture");
      setProfilePicture(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showSuccess("Profile picture removed");
    } catch {
      showError("Could not connect to server");
    }
  };

  // ─── Notifications (auto-save on toggle) ─────────────────────────────────────
  const handleNotificationChange = async (key: string, value: boolean) => {
    const updated = { ...notifications, [key]: value };
    setNotifications(updated);
    try {
      await fetch(`${API}/notifications`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(updated),
      });
    } catch {
      showError("Failed to save notification preference");
    }
  };

  // ─── Download QR code ────────────────────────────────────────────────────────
  const downloadQrCode = () => {
    if (!qrCodeImage) return;
    const link = document.createElement("a");
    link.href = qrCodeImage;
    link.download = "my-event-pass.png";
    link.click();
  };

  // ─── Delete account ──────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    if (!confirm("Are you absolutely sure? This action cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5001/api/users/me`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        signOut();
        window.location.href = "/";
      } else {
        showError("Failed to delete account");
      }
    } catch {
      showError("Could not connect to server");
    }
  };

  return (
    <DashboardLayout
      title="Settings"
      subtitle="Manage your account preferences and security settings."
      showSponsor
    >
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Messages */}
        {successMessage && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-600 border border-green-200 text-center">
            ✓ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 border border-red-200 text-center">
            ✕ {errorMessage}
          </div>
        )}

        {/* Profile Picture */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2">
              <Camera size={20} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Profile Picture</h2>
              <p className="text-xs text-gray-400">Upload a photo to personalize your account</p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              {profilePicture ? (
                <div className="relative">
                  <img src={profilePicture} alt="Profile" className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg" />
                  <button onClick={removeProfilePicture} className="absolute -top-1 -right-1 rounded-full bg-red-100 p-1 text-red-600 hover:bg-red-200 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center border-4 border-white shadow-lg">
                  <User size={48} className="text-indigo-400" />
                </div>
              )}
            </div>
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
              onDrop={handleDrop}
              className={`w-full max-w-md rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                isDragging ? "border-indigo-400 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="profile-picture-input" />
              <div className="space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center">
                  <Upload size={20} className="text-indigo-600" />
                </div>
                <div>
                  <label htmlFor="profile-picture-input" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer">
                    Click to upload
                  </label>
                  <span className="text-xs text-gray-400"> or drag and drop</span>
                </div>
                <p className="text-xs text-gray-400">PNG, JPG, GIF up to 2MB</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2"><User size={20} className="text-indigo-600" /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Profile Information</h2>
              <p className="text-xs text-gray-400">Update your personal details</p>
            </div>
          </div>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">First Name</label>
                <input className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none" value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Name</label>
                <input className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none" value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
              <input type="email" className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
                <input type="tel" className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Organization</label>
                <input className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm text-gray-900 shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })} />
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50">
                <Save size={16} />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Password & Security */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2"><Lock size={20} className="text-indigo-600" /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Password & Security</h2>
              <p className="text-xs text-gray-400">Update your password and security settings</p>
            </div>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Current Password</label>
              <input type="password" className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} required />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">New Password</label>
                <input type="password" className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Confirm Password</label>
                <input type="password" className="w-full h-11 rounded-xl border border-gray-100 bg-white px-4 text-sm shadow-sm focus:border-indigo-300 focus:ring-1 focus:ring-indigo-100 outline-none" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} required />
              </div>
            </div>
            <div className="flex justify-center pt-2">
              <button type="submit" disabled={isSubmitting} className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 disabled:opacity-50">
                {isSubmitting ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* My Pass / QR Code */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2"><QrCode size={20} className="text-indigo-600" /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">My Pass</h2>
              <p className="text-xs text-gray-400">Your unique identity QR code for event check-ins</p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-6 sm:flex-row">
            <div className="flex-shrink-0 rounded-2xl border border-gray-100 bg-gray-50 p-4">
              <div className="h-40 w-40 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm">
                {qrCodeImage
                  ? <img src={qrCodeImage} alt="QR Code" className="h-36 w-36" />
                  : <QrCode size={100} className="text-gray-300 animate-pulse" />
                }
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">QR Code ID</p>
                <p className="mt-1 text-sm font-mono font-medium text-gray-700 break-all">
                  {qrCodeId ?? "Generating..."}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Status</p>
                <span className="mt-1 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">Active</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                This is your unique identity pass. Present this QR code at any event you have registered for to check in. Do not share it with others.
              </p>
              <button onClick={downloadQrCode} disabled={!qrCodeImage} className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">
                <Download size={15} />
                Download QR Code
              </button>
            </div>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-5">
            <h3 className="text-sm font-bold text-gray-900 mb-3">Scan History</h3>
            <div className="space-y-2">
              {scanHistory.length > 0 ? scanHistory.map((scan, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{scan.event}</p>
                    <p className="text-xs text-gray-400">{scan.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-gray-600">{scan.date}</p>
                    <p className="text-xs text-gray-400">{scan.time}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-gray-400">No check-ins yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-indigo-50 p-2"><Bell size={20} className="text-indigo-600" /></div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
              <p className="text-xs text-gray-400">Manage your notification preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            {([
              { key: "emailReminders",  label: "Email Reminders",  description: "Get reminded about upcoming events" },
              { key: "qrAlerts",        label: "QR Alerts",        description: "Receive alerts when your QR code is scanned" },
              { key: "marketingEmails", label: "Marketing Emails", description: "Receive updates about new features and events" },
              { key: "eventUpdates",    label: "Event Updates",    description: "Get notified when events you're attending are updated" },
            ] as const).map((item) => (
              <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifications[item.key]}
                    onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-xl bg-red-100 p-2"><AlertTriangle size={20} className="text-red-600" /></div>
            <div>
              <h2 className="text-lg font-bold text-red-900">Danger Zone</h2>
              <p className="text-xs text-red-600">Irreversible actions for your account</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="text-sm font-medium text-gray-900">Delete Account</p>
              <p className="text-xs text-gray-500">Permanently delete your account and all associated data</p>
            </div>
            <button onClick={handleDeleteAccount} className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-600 hover:text-white transition-all">
              Delete Account
            </button>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}