import type { Event, Booking } from "../types";

const API_BASE = "http://localhost:5001/api";

/**
 * Get auth token from localStorage
 */
function getAuthToken(): string | null {
  try {
    const authUser = localStorage.getItem("authUser");
    if (!authUser) return null;
    const { token } = JSON.parse(authUser);
    return token;
  } catch {
    return null;
  }
}

/**
 * Fetch all events with optional filters
 */
export async function fetchEvents(
  category?: string,
  status?: string
): Promise<Event[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append("category", category);
    if (status) params.append("status", status);

    const url = `${API_BASE}/events${params.size > 0 ? `?${params}` : ""}`;
    const res = await fetch(url);

    if (!res.ok) throw new Error("Failed to fetch events");
    return await res.json();
  } catch (err) {
    console.error("Error fetching events:", err);
    throw err;
  }
}

/**
 * Fetch single event by ID
 */
export async function fetchEventById(eventId: string): Promise<Event> {
  try {
    const res = await fetch(`${API_BASE}/events/${eventId}`);

    if (!res.ok) {
      if (res.status === 404) throw new Error("Event not found");
      throw new Error("Failed to fetch event");
    }

    return await res.json();
  } catch (err) {
    console.error("Error fetching event:", err);
    throw err;
  }
}

/**
 * Book an event (create individual booking)
 */
export async function bookEvent(eventId: string): Promise<Booking> {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated. Please log in.");

    const res = await fetch(`${API_BASE}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ eventId }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to book event");
    }

    const data = await res.json();
    return data.booking;
  } catch (err) {
    console.error("Error booking event:", err);
    throw err;
  }
}

/**
 * Cancel a booking
 */
export async function cancelBooking(bookingId: string): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated. Please log in.");

    const res = await fetch(`${API_BASE}/bookings/${bookingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to cancel booking");
    }
  } catch (err) {
    console.error("Error cancelling booking:", err);
    throw err;
  }
}

/**
 * Save an event for later
 */
export async function saveEvent(eventId: string): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated. Please log in.");

    const res = await fetch(`${API_BASE}/users/me/saved/${eventId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to save event");
    }
  } catch (err) {
    console.error("Error saving event:", err);
    throw err;
  }
}

/**
 * Remove a saved event
 */
export async function unsaveEvent(eventId: string): Promise<void> {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated. Please log in.");

    const res = await fetch(`${API_BASE}/users/me/saved/${eventId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to unsave event");
    }
  } catch (err) {
    console.error("Error unsaving event:", err);
    throw err;
  }
}

/**
 * Get user's saved events
 */
export async function getSavedEvents(): Promise<Event[]> {
  try {
    const token = getAuthToken();
    if (!token) throw new Error("Not authenticated. Please log in.");

    const res = await fetch(`${API_BASE}/users/me/saved`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch saved events");
    return await res.json();
  } catch (err) {
    console.error("Error fetching saved events:", err);
    throw err;
  }
}

/**
 * Check if event is saved by user
 */
export async function isEventSaved(eventId: string): Promise<boolean> {
  try {
    const saved = await getSavedEvents();
    return saved.some(e => e._id === eventId);
  } catch {
    return false;
  }
}
