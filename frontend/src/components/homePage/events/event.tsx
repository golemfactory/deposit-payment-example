import { Event, EventType, Payload } from "types/events";

import { Card } from "react-daisyui";

import { motion } from "framer-motion";
const variants = {
  visible: { opacity: 1, transition: { duration: 1 } },
  hidden: { opacity: 0, transition: { duration: 1 } },
};

const AllocationCreatedEvent = (event: {
  kind: Event.ALLOCATION_CREATED;
  payload: Payload[Event.ALLOCATION_CREATED];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Allocation Created</Card.Title>
        <div>
          <div>Allocation ID: {event.payload.allocationId}</div>
          <div>Amount: {event.payload.amount}</div>
          <div>Recipient: {event.payload.validityTimestamp}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

const AllocationReleasedEvent = (event: {
  kind: Event.ALLOCATION_RELEASED;
  payload: Payload[Event.ALLOCATION_RELEASED];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Allocation Released</Card.Title>
        <div>
          <div>Allocation ID: {event.payload.allocationId}</div>
        </div>
      </Card.Body>
    </Card>
  );
};

export const EventCard = (event: EventType) => {
  return (
    <motion.div variants={variants} initial="hidden" animate="visible">
      {(() => {
        switch (event.kind) {
          case Event.ALLOCATION_CREATED:
            return <AllocationCreatedEvent {...event} />;
          case Event.ALLOCATION_RELEASED:
            return <AllocationReleasedEvent {...event} />;
        }
      })()}
    </motion.div>
  );
};
