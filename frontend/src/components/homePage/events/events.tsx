import { useState } from "react";
import { EventType } from "types/events";
import { useAllocationEvents } from "hooks/events/useAllocationEvents";

export const Events = () => {
  const [events, setEvents] = useState<EventType[]>([]);
  const { events$: allocationEvents$ } = useAllocationEvents();

  allocationEvents$.subscribe((event) => {
    setEvents((prevEvents) => [...prevEvents, event]);
  });
};
