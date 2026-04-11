import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 px-6 py-6">
      <div className="flex flex-col items-center justify-between gap-3 text-xs text-gray-400 sm:flex-row">
        <div className="flex flex-wrap gap-5">
          <Link to="/browse-events" className="transition-colors hover:text-gray-600">
            Browse Events
          </Link>
          <Link to="/contact" className="transition-colors hover:text-gray-600">
            Contact
          </Link>
          <Link to="/policies" className="transition-colors hover:text-gray-600">
            Policies
          </Link>
          <Link to="/terms" className="transition-colors hover:text-gray-600">
            Terms of Use
          </Link>
        </div>
        <p>© 2026 EventHub. All rights reserved.</p>
      </div>
    </footer>
  );
}