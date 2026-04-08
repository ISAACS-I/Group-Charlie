import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/user/Home";
import BrowseEvents from "../pages/user/BrowseEvents";
import OrganiserHome from "../pages/organiser/OrganiserHome";
import UserLogin from "../pages/authentication/UserLogIn";
import UserSignup from "../pages/authentication/UserSignUp";
import Analytics from "../pages/organiser/Analytics";
import Settings from "../pages/settings/Settings";

const Placeholder = ({ name }: { name: string }) => (
  <div className="flex h-screen items-center justify-center text-sm text-gray-400">
    {name} — coming soon
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/browse-events" element={<BrowseEvents />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/categories" element={<Placeholder name="Categories" />} />
      <Route path="/events/:id" element={<Placeholder name="Event Detail" />} />

      {/* Protected User Routes */}
      <Route
        path="/my-bookings"
        element={
          <ProtectedRoute>
            <Placeholder name="My Bookings" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/saved-events"
        element={
          <ProtectedRoute>
            <Placeholder name="Saved Events" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/qr-codes"
        element={
          <ProtectedRoute>
            <Placeholder name="QR Codes" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* Protected Organiser Routes */}
      <Route
        path="/organiser-home"
        element={
          <ProtectedRoute requireAdmin>
            <OrganiserHome />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-event"
        element={
          <ProtectedRoute requireAdmin>
            <Placeholder name="Create Event" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-events"
        element={
          <ProtectedRoute requireAdmin>
            <Placeholder name="My Events" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendees"
        element={
          <ProtectedRoute requireAdmin>
            <Placeholder name="Attendees" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <ProtectedRoute requireAdmin>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}