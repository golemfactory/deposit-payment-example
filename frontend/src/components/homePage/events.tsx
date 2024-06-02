import { useWatchDepositPayments } from "hooks/depositContract/useWatchDepositPayments";
import { Card } from "react-daisyui";

export const Events = () => {
  const events = useWatchDepositPayments();
  return (
    <>
      {["Event1", "Event2", "Event3", "Event4", "Event5"].map(
        (event, index) => {
          return (
            <Card bordered={true} key={index}>
              <Card.Body>
                <Card.Title>Event {index + 1}</Card.Title>
                This is the description of the event {index + 1}
              </Card.Body>
            </Card>
          );
        }
      )}
    </>
  );
};
