import React from "react-reacter";
import EventCard from "./EventCard";

export default function EventGrid({ events = [], onEventAction }) {
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