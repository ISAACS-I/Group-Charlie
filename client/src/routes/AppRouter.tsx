import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../pages/user/Home";
import BrowseEvents from "../pages/user/BrowseEvents";
import OrganiserHome from "../pages/organiser/OrganiserHome";
import PaymentPage from "../pages/user/Payment";
import UserLogin from "../pages/authentication/UserLogIn";
import UserSignup from "../pages/authentication/UserSignUp";
import Settings from "../pages/settings/Settings";
import ManageEvent from "../pages/organiser/ManageEvent";
import Analytics from "../pages/organiser/Analytics";
import EventDetails from "../pages/user/EventDetails";
import CreateEventPage from "../pages/organiser/CreateEvents";
import MyEventsPage from "../pages/user/MyEvents";
import AttendeesPage from "../pages/organiser/Attendees";


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
      <Route path="/login" element={<Placeholder name="Login" />} />
      <Route path="/payment" element={<PaymentPage />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/browse-events/id:1" element={<EventDetails />} />
      <Route path="/create-event" element={<CreateEventPage />} />
      <Route path="/my-events" element={<MyEventsPage />} />
      <Route path="/attendees" element={<AttendeesPage />} />
     


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
        path="/manage-event/:id"
        element={
          <ProtectedRoute requireAdmin>
            <ManageEvent />
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