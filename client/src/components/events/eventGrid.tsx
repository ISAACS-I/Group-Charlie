import EventCard from "./eventCard";
import type { EventItem } from "../../types";

interface EventGridProps {
  events: EventItem[];
  onEventAction?: (event: EventItem) => void;
}

export default function EventGrid({ events, onEventAction }: EventGridProps) {
  return (
    <section className="events-grid">
      {events.map((event) => (
        <EventCard
          key={event.id}
          {...event}
          onAction={() => onEventAction?.(event)}
        />
      ))}
    </section>
  );
}