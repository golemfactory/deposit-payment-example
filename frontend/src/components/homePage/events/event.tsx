import { Event, EventType, Payload } from "types/events";

import { Card } from "react-daisyui";

import { motion } from "framer-motion";
import { EtherScanLink } from "components/atoms/etherscanLink";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { formatBalance } from "utils/formatBalance";
import { parseEther } from "viem";
import dayjs from "dayjs";
import { ShortLink } from "components/shortLink";
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

const DepositCreatedEvent = (event: {
  kind: Event.DEPOSIT_CREATED;
  payload: Payload[Event.DEPOSIT_CREATED];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Deposit Created</Card.Title>
        <div>
          <div className="flex gap-2">
            <div className="stat-title"> TX Hash: </div>

            <EtherScanLink hash={event.payload.txHash}></EtherScanLink>
          </div>
          <div className="flex gap-2">
            <div className="stat-title"> Amount: </div>
            <GLMAmountStat
              amount={formatBalance(
                parseEther(event.payload.amount.toString())
              )}
            ></GLMAmountStat>{" "}
          </div>
          <div className="flex gap-2">
            <div className="stat-title"> Fee: </div>
            <GLMAmountStat
              amount={formatBalance(parseEther(event.payload.fee.toString()))}
            ></GLMAmountStat>{" "}
          </div>
          <div className="flex gap-2">
            <div className="stat-title"> Valid to: </div>
            {dayjs(event.payload.validityTimestamp * 1000).format("YYYY-MM-DD")}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const AgreementCreatedEvent = (event: {
  kind: Event.AGREEMENT_SIGNED;
  payload: Payload[Event.AGREEMENT_SIGNED];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Agreement Created</Card.Title>
        <div>
          <div>
            Agreement ID: <ShortLink id={event.payload.agreementId}></ShortLink>
          </div>
          <div>
            ProviderId :{" "}
            <EtherScanLink
              hash={event.payload.offer.providerId}
              route="address"
            ></EtherScanLink>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const AgreementTerminatedEvent = (event: {
  kind: Event.AGREEMENT_TERMINATED;
  payload: Payload[Event.AGREEMENT_TERMINATED];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Agreement Terminated</Card.Title>
        <div>
          <div>
            Agreement ID: <ShortLink id={event.payload.agreementId}></ShortLink>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const DepositExtendedEvent = (event: {
  kind: Event.DEPOSIT_EXTENDED;
  payload: Payload[Event.DEPOSIT_EXTENDED];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Deposit Extended</Card.Title>
        <div>
          <div className="flex gap-2">
            <div className="stat-title"> TX Hash: </div>

            <EtherScanLink hash={event.payload.txHash}></EtherScanLink>
          </div>
          <div className="flex gap-2">
            <div className="stat-title"> Extra Amount: </div>
            <GLMAmountStat
              amount={formatBalance(
                parseEther(event.payload.amount.toString())
              )}
            ></GLMAmountStat>{" "}
          </div>
          <div className="flex gap-2">
            <div className="stat-title"> Extra Fee: </div>
            <GLMAmountStat
              amount={formatBalance(parseEther(event.payload.fee.toString()))}
            ></GLMAmountStat>{" "}
          </div>
          <div className="flex gap-2">
            <div className="stat-title"> New Valid to: </div>
            {dayjs(event.payload.validityTimestamp * 1000).format("YYYY-MM-DD")}
          </div>
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
          case Event.DEPOSIT_CREATED:
            return <DepositCreatedEvent {...event} />;
          case Event.DEPOSIT_EXTENDED:
            return <DepositExtendedEvent {...event} />;
          case Event.AGREEMENT_SIGNED:
            return <AgreementCreatedEvent {...event} />;
          case Event.AGREEMENT_TERMINATED:
            return <AgreementTerminatedEvent {...event} />;
        }
      })()}
    </motion.div>
  );
};
