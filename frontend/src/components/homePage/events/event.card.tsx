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

// const NewDebitNoteEvent = (event: {
//   kind: Event.NEW_DEBIT_NOTE;
//   payload: Payload[Event.NEW_DEBIT_NOTE];
// }) => {
//   return (
//     <>
//       {event.payload.paymentDueDate ? (
//         <Card bordered={true}>
//           <Card.Body>
//             <Card.Title>New Payable Debit Note</Card.Title>
//             <div className="flex gap-2">
//               <div className="stat-title">ID:</div>
//               <div>
//                 <ShortLink id={event.payload.debitNoteId}></ShortLink>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <div className="stat-title">Agreement ID:</div>
//               <div>
//                 <ShortLink id={event.payload.agreementId}></ShortLink>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <div className="stat-title">Amount </div>
//               <div>
//                 <GLMAmountStat
//                   amount={formatBalance(
//                     parseEther(event.payload.totalAmountDue)
//                   )}
//                 ></GLMAmountStat>
//               </div>
//             </div>
//           </Card.Body>
//         </Card>
//       ) : null}
//     </>
//   );
// };
