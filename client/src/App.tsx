import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/user/home";
import OrganiserHome from "./pages/organiser/organiserHome";
import BrowseEvents from "./pages/user/browseEvents";

export default function App() {
  // TEMP role simulation (frontend only)
  const role = localStorage.getItem("role") || "user";

  return (
    <Routes>
      {/* Default route */}
      <Route
        path="/"
        element={
          role === "admin" ? (
            <Navigate to="/organiser-home" />
          ) : (
            <Navigate to="/home" />
          )
        }
      />

      {/* User */}
      <Route path="/home" element={<Home />} />
      <Route path="/browse-events" element={<BrowseEvents />} />

      {/* Admin */}
      <Route path="/organiser-home" element={<OrganiserHome />} />
    </Routes>
  );
}