import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/user/Home";
import BrowseEvents from "../pages/user/BrowseEvents";
import OrganiserHome from "../pages/organiser/OrganiserHome";
import UserSignup from "../pages/authentication/UserSignUp";

const Placeholder = ({ name }: { name: string }) => (
  <div className="flex h-screen items-center justify-center text-sm text-gray-400">
    {name} — coming soon
  </div>
);

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />

      <Route path="/home" element={<Home />} />
      <Route path="/browse-events" element={<BrowseEvents />} />
      <Route path="/login" element={<Placeholder name="Login" />} />
      <Route path="/signup" element={<UserSignup />} />

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
            <Placeholder name="Settings" />
          </ProtectedRoute>
        }
      />
      <Route path="/events/:id" element={<Placeholder name="Event Detail" />} />

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
            <Placeholder name="Analytics" />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}