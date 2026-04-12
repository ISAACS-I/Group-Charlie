import logoImage from '../../assets/logo.png'; 

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  showSponsor?: boolean;
}

export default function Topbar({ title, subtitle, onMenuClick, showSponsor }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 h-16">
      <div className="flex items-start gap-4">
        <button
          onClick={onMenuClick}
          type="button"
          className="rounded-xl border border-gray-200 bg-white p-2 text-gray-500 shadow-sm transition-colors hover:text-gray-800"
          aria-label="Open menu"
        >
          <svg
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="19" y2="6" />
            <line x1="3" y1="12" x2="19" y2="12" />
            <line x1="3" y1="18" x2="19" y2="18" />
          </svg>
        </button>

        <div>
          <h1 className="text-xl font-bold leading-tight text-gray-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>}
        </div>
      </div>

      {showSponsor && (
        <div className="hidden sm:flex">
            <img 
              src={logoImage} 
              alt="Logo"
              className="h-60 w-auto object-contain"
            />
          </div>
      )}
    </header>
  );
}