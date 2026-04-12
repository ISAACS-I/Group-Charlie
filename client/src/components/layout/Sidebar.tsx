import { NavLink } from "react-router-dom";
import type { SidebarSection, SidebarLink } from "../../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SidebarSection[];
  bottomLinks: SidebarLink[];
  onLogout?: () => void; // Add this for logout handling
}

export default function Sidebar({ isOpen, onClose, sections, bottomLinks, onLogout }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-0 z-50 flex h-full w-60 flex-col bg-gray-950 text-white shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
          <span className="text-lg font-bold tracking-tight">EventHub</span>
          <button
            onClick={onClose}
            className="text-white/60 transition-colors hover:text-white"
            aria-label="Close sidebar"
            type="button"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white/30">
                {section.label}
              </p>

              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <NavLink
                      to={link.href}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "bg-gradient-to-r from-indigo-600 to-violet-600 font-medium text-white"
                            : "text-white/70 hover:bg-white/10 hover:text-white"
                        }`
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/10 px-3 py-4">
          {bottomLinks.map((link) => {
            // Handle logout differently
            if (link.href === "/logout" || link.label.toLowerCase().includes("sign out")) {
              return (
                <button
                  key={link.href}
                  onClick={() => {
                    onLogout?.();
                    onClose();
                  }}
                  className="block w-full text-left rounded-xl px-3 py-2.5 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  {link.label}
                </button>
              );
            }

            // Regular NavLink for other bottom links (Settings, Login, Signup)
            return (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={onClose}
                className={({ isActive }) =>
                  `block rounded-xl px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-violet-600 font-medium text-white"
                      : "text-white/60 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            );
          })}
        </div>
      </aside>
    </>
  );
}