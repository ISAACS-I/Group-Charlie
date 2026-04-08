import { useState } from "react";
import type { FormEvent } from "react";

export default function Settings() {
  const [name, setName] = useState("Kevin");
  const [email, setEmail] = useState("kevin@email.com");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-2xl font-bold">Settings</h1>

      {/* Profile */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="font-semibold text-lg mb-4">Profile Information</h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
          <input
            className="border rounded-lg p-3"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="border rounded-lg p-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="col-span-2 flex justify-end">
            <button className="bg-black text-white px-6 py-2 rounded-lg">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      {/* Password */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="font-semibold text-lg mb-4">Password & Security</h2>

        <div className="space-y-4">
          <input className="w-full border rounded-lg p-3" placeholder="New Password" />
          <input className="w-full border rounded-lg p-3" placeholder="Confirm Password" />

          <button className="bg-black text-white px-6 py-2 rounded-lg">
            Update Password
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border">
        <h2 className="font-semibold text-lg mb-4">Notifications</h2>

        <div className="space-y-3">
          {["Email Reminders", "QR Alerts", "Marketing Emails"].map((item) => (
            <div key={item} className="flex justify-between items-center">
              <span>{item}</span>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
        <h2 className="text-red-600 font-semibold mb-3">Danger Zone</h2>
        <button className="bg-red-600 text-white px-6 py-2 rounded-lg">
          Delete Account
        </button>
      </div>
    </div>
  );
}