import { AnimatePresence, motion } from "framer-motion";
import { ReactElement } from "react";
import { Card } from "react-daisyui";
import { EventTitle, EventType } from "types/events";
export const EventCardScaffold = ({
  event,
  template,
}: {
  event: EventType & { isExpanded: boolean; toggleExpanded: () => void };
  template: ReactElement;
}) => {
  return (
    <Card className="transition-all duration-1300 ease-out">
      <Card.Body>
        <Card.Title>
          <div className="w-full flex justify-between">
            {EventTitle[event.kind]}

            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 "
              animate={{ rotate: event.isExpanded ? 180 : 0 }}
              onClick={() => {
                event.toggleExpanded();
              }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </motion.svg>
          </div>
        </Card.Title>
        <AnimatePresence>
          {event.isExpanded ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {template}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Card.Body>
    </Card>
  );
};
