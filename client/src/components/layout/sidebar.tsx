import type { SidebarLink, SidebarSection } from "../../types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sections: SidebarSection[];
  bottomLinks: SidebarLink[];
}

export default function Sidebar({
  isOpen,
  onClose,
  sections,
  bottomLinks,
}: SidebarProps) {
  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-top">
          <div className="brand">EventHub</div>
          <button className="close-btn" onClick={onClose} aria-label="Close sidebar">
            &times;
          </button>
        </div>

        <div>
          {sections.map((section) => (
            <div className="nav-group" key={section.label}>
              <p className="nav-label">{section.label}</p>
              {section.links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`nav-item ${link.active ? "active" : ""}`}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="sidebar-bottom">
          {bottomLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`nav-item ${link.active ? "active" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>
      </aside>

      <div className={`overlay ${isOpen ? "show" : ""}`} onClick={onClose}></div>
    </>
  );
}