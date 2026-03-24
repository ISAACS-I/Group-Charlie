export type UserRole = "user" | "admin";

export interface SidebarLink {
  label: string;
  href: string;
  active?: boolean;
}

export interface SidebarSection {
  label: string;
  links: SidebarLink[];
}

export interface EventItem {
  id: number | string;
  category?: string;
  categoryClass?: string;
  registered?: string;
  title: string;
  description?: string;
  date?: string;
  time?: string;
  location?: string;
  price?: string;
  tag?: string;
  imageClass?: string;
  buttonText?: string;
}