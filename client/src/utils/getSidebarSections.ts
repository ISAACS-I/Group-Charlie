import type { SidebarSection } from "../types";

export function getSidebarSections(isAdmin: boolean): SidebarSection[] {
  const sections: SidebarSection[] = [
    {
      label: "Explore",
      links: [
        { label: "Home", href: "/home" },
        { label: "Browse Events", href: "/browse-events" },
        { label: "Categories", href: "/categories" },
      ],
    },
    {
      label: "Personal",
      links: [
        { label: "My Bookings", href: "/my-bookings" },
        { label: "Saved Events", href: "/saved-events" },
      ],
    },
  ];

  if (isAdmin) {
    sections.push({
      label: "Organiser",
      links: [
        { label: "Overview", href: "/organiser-home" },
        { label: "Create Event", href: "/create-event" },
        { label: "My Events", href: "/my-events" },
        { label: "Attendees", href: "/attendees" },
        { label: "Analytics", href: "/analytics" },
      ],
    });
  }

  return sections;
}