export type UserRole = "user" | "admin";

export interface SidebarLink {
  label: string;
  href: string;
}

export interface SidebarSection {
  label: string;
  links: SidebarLink[];
}

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  hasAgeRestriction?: boolean;
  minAge?: number;
  category?: string;
  registered?: string;
  date?: string;
  time?: string;
  location?: string;
  price?: string;
  tag?: string;
  status?: "Active" | "Upcoming" | "Draft";
  imageBg?: string;
  thumbnail?: string; 
  buttonText?: string;
}

export interface Event {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  type?: string;
  date?: string | Date;
  time?: string;
  duration?: string;
  location?: string;
  directions?: string;
  price?: number;
  imageBg?: string;
  thumbnail?: string;
  banner?: string;
  gallery?: string[];
  status?: "Active" | "Upcoming" | "Draft";
  organiser?: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  capacity?: number;
  hasAgeRestriction?: boolean;
  minAge?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  _id: string;
  user: string;
  event: Event;
  status: "confirmed" | "pending" | "cancelled";
  scannedAt?: Date;
  createdAt: string;
  updatedAt: string;
}

export interface SavedEvent {
  _id: string;
  user: string;
  event: Event;
  createdAt: string;
  updatedAt: string;
}
