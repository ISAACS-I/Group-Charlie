import type { EventItem } from "../../types";

interface EventCardProps extends EventItem {
  onAction?: () => void;
}

export default function EventCard({
  category,
  categoryClass = "",
  registered,
  title,
  description,
  date,
  time,
  location,
  price,
  tag,
  imageClass = "",
  buttonText = "Register Now",
  onAction,
}: EventCardProps) {
  return (
    <article className="event-card">
      <div className={`event-image ${imageClass}`}>
        {tag && (
          <span className={`badge ${tag === "Popular" ? "badge-danger" : "badge-warning"}`}>
            {tag}
          </span>
        )}
        {price && <span className="badge badge-light">{price}</span>}
      </div>

      <div className="event-body">
        <div className="event-meta-top">
          {category && <span className={`category ${categoryClass}`}>{category}</span>}
          {registered && (
            <>
              <span className="dot">•</span>
              <span className="registered">{registered}</span>
            </>
          )}
        </div>

        <h3>{title}</h3>
        {description && <p className="event-desc">{description}</p>}

        <div className="event-info">
          {date && <p>{date}</p>}
          {time && <p>{time}</p>}
          {location && <p>{location}</p>}
        </div>

        <button className="primary-btn" onClick={onAction}>
          {buttonText}
        </button>
      </div>
    </article>
  );
}