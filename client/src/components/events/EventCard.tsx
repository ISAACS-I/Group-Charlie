import Badge from "../ui/Badge";
import type { EventItem } from "../../types";

interface EventCardProps extends EventItem {
  onAction?: () => void;
}

export default function EventCard({
  title,
  description,
  category,
  status,
  registered,
  date,
  location,
  tag,
  imageBg,
  buttonText = "View Event",
  onAction,
}: EventCardProps) {
  const badgeLabel = status ?? category ?? "";
  const badgeVariant =
    status === "Active" ? "active" :
    status === "Upcoming" ? "upcoming" :
    status === "Draft" ? "draft" :
    "category";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Image area */}
      <div
        className="h-44 w-full flex-shrink-0"
        style={{ background: imageBg ?? "linear-gradient(135deg, #e0e7ff, #c7d2fe)" }}
      >
        {tag && (
          <div className="p-3">
            <Badge label={tag} variant="tag" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          {badgeLabel && <Badge label={badgeLabel} variant={badgeVariant} />}
          {registered && (
            <span className="text-xs text-gray-400">• {registered}</span>
          )}
        </div>

        <h3 className="text-base font-semibold text-gray-900 leading-snug mb-1">{title}</h3>

        {description && (
          <p className="text-sm text-gray-500 leading-relaxed mb-3 line-clamp-2">{description}</p>
        )}

        <div className="mt-auto space-y-1">
          {date && <p className="text-xs text-gray-400">{date}</p>}
          {location && <p className="text-xs text-gray-400">{location}</p>}
        </div>

        <button
          type="button"
          onClick={onAction}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-xl transition-colors duration-150"
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}
