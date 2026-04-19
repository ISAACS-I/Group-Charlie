import logoImage from '../../assets/logo.png';

interface TopbarProps {
  title: string;
  subtitle?: string;
  onMenuClick: () => void;
  showSponsor?: boolean;
  userName?: string;
  isLoggedIn?: boolean;
  onLogin?: () => void;
}

export default function Topbar({
  title,
  subtitle,
  onMenuClick,
  showSponsor,
  userName,
  isLoggedIn,
  onLogin,
}: TopbarProps) {
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

      <div className="flex items-center gap-3">
        {isLoggedIn && userName ? (
          <div className="hidden sm:flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium text-gray-700">{userName}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={onLogin}
            className="hidden sm:block rounded-xl bg-indigo-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
          >
            Sign In
          </button>
        )}

        {showSponsor && (
          <div className="hidden sm:flex">
            <img
              src={logoImage}
              alt="Logo"
              className="h-60 w-auto object-contain"
            />
          </div>
        )}
      </div>
    </header>
  );
}