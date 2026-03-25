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
  category?: string;
  registered?: string;
  date?: string;
  time?: string;
  location?: string;
  price?: string;
  tag?: string;
  status?: "Active" | "Upcoming" | "Draft";
  imageBg?: string;
  buttonText?: string;
}
