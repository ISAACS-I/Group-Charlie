import EventCard from "./EventCard";
import type { EventItem } from "../../types";

interface EventGridProps {
  events: EventItem[];
  onEventAction?: (event: EventItem) => void;
}

export default function EventGrid({ events, onEventAction }: EventGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {events.map((event) => (
        <EventCard
          key={event.id}
          {...event}
          onAction={() => onEventAction?.(event)}
        />
      ))}
    </div>
  );
}
