import { Event, EventType, Payload } from "types/events";

import { Card } from "react-daisyui";

import { motion } from "framer-motion";
import { EtherScanLink } from "components/atoms/etherscanLink";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { formatBalance } from "utils/formatBalance";
import { parseEther } from "viem";
import dayjs from "dayjs";
import { ShortLink } from "components/atoms/shortLink";
import { EventCardScaffold } from "./event.card";
const variants = {
  visible: { opacity: 1, transition: { duration: 1 } },
  hidden: { opacity: 0, transition: { duration: 1 } },
};

const AllocationCreatedEvent = (event: {
  kind: Event.ALLOCATION_CREATED;
  payload: Payload[Event.ALLOCATION_CREATED];
}) => {
  return (
    <div>
      <div>Allocation ID: {event.payload.allocationId}</div>
      <div>Amount: {event.payload.amount}</div>
      <div>Recipient: {event.payload.validityTimestamp}</div>
    </div>
  );
};

const AllocationReleasedEvent = (event: {
  kind: Event.ALLOCATION_RELEASED;
  payload: Payload[Event.ALLOCATION_RELEASED];
}) => {
  return (
    <div>
      <div>Allocation ID: {event.payload.allocationId}</div>
    </div>
  );
};

const DepositCreatedEvent = (event: {
  kind: Event.DEPOSIT_CREATED;
  payload: Payload[Event.DEPOSIT_CREATED];
}) => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="stat-title"> TX Hash: </div>

        <EtherScanLink hash={event.payload.txHash}></EtherScanLink>
      </div>
      <div className="flex gap-2">
        <div className="stat-title"> Amount: </div>
        <GLMAmountStat
          amount={formatBalance(parseEther(event.payload.amount.toString()))}
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
  );
};

const AgreementCreatedEvent = (event: {
  kind: Event.AGREEMENT_SIGNED;
  payload: Payload[Event.AGREEMENT_SIGNED];
}) => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="stat-title"> Agreement Id: </div>

        <ShortLink id={event.payload.agreementId}></ShortLink>
      </div>
      <div className="flex gap-2">
        <div className="stat-title">ProviderId : </div>
        <EtherScanLink
          hash={event.payload.offer.providerId}
          route="address"
        ></EtherScanLink>
      </div>
    </div>
  );
};

const AgreementTerminatedEvent = (event: {
  kind: Event.AGREEMENT_TERMINATED;
  payload: Payload[Event.AGREEMENT_TERMINATED];
}) => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="stat-title"> Agreement ID: </div>{" "}
        <ShortLink id={event.payload.agreementId}></ShortLink>
      </div>
    </div>
  );
};

const DepositExtendedEvent = (event: {
  kind: Event.DEPOSIT_EXTENDED;
  payload: Payload[Event.DEPOSIT_EXTENDED];
}) => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="stat-title"> TX Hash: </div>

        <EtherScanLink hash={event.payload.txHash}></EtherScanLink>
      </div>
      <div className="flex gap-2">
        <div className="stat-title"> Extra Amount: </div>
        <GLMAmountStat
          amount={formatBalance(parseEther(event.payload.amount.toString()))}
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
  );
};

const DepositProviderPaymentEvent = (event: {
  kind: Event.DEPOSIT_PROVIDER_PAYMENT;
  payload: Payload[Event.DEPOSIT_PROVIDER_PAYMENT];
}) => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="stat-title">TX Hash : </div>
        <EtherScanLink hash={event.payload.txHash} route="tx"></EtherScanLink>
      </div>
      <div className="flex gap-2">
        <div className="stat-title">Amount : </div>
        <GLMAmountStat
          amount={formatBalance(event.payload.amount)}
        ></GLMAmountStat>
      </div>
    </div>
  );
};

const NewInvoiceEvent = (event: {
  kind: Event.NEW_INVOICE;
  payload: Payload[Event.NEW_INVOICE];
}) => {
  return (
    <>
      <div className="flex gap-2">
        <div className="stat-title">Invoice ID</div>:{" "}
        <ShortLink id={event.payload.invoiceId}></ShortLink>
      </div>
      <div className="flex gap-2">
        <div className="stat-title">Agreement ID: </div>:{" "}
        <ShortLink id={event.payload.agreementId}></ShortLink>
      </div>
      <div className="flex gap-2">
        <div className="stat-title">Amount</div>:{" "}
        <GLMAmountStat
          amount={formatBalance(parseEther(event.payload.amount))}
        ></GLMAmountStat>
      </div>
    </>
  );
};

const DepositFeePaymentEvent = (event: {
  kind: Event.DEPOSIT_FEE_PAYMENT;
  payload: Payload[Event.DEPOSIT_FEE_PAYMENT];
}) => {
  return (
    <div>
      <div className="flex gap-2">
        <div className="stat-title">Transaction: </div>
        <EtherScanLink hash={event.payload.txHash}></EtherScanLink>
      </div>
      <div className="flex gap-2">
        <div className="stat-title">Amount: </div>
        <GLMAmountStat
          amount={formatBalance(event.payload.amount)}
        ></GLMAmountStat>
      </div>
    </div>
  );
};

const DepositProviderPayment = (event: {
  kind: Event.DEPOSIT_PROVIDER_PAYMENT;
  payload: Payload[Event.DEPOSIT_PROVIDER_PAYMENT];
}) => {
  return (
    <div>
      <div>
        Agreement IsD: <ShortLink id={event.payload.depositId}></ShortLink>
      </div>
      <div>
        TX Hash :{" "}
        <EtherScanLink
          hash={event.payload.txHash}
          route="address"
        ></EtherScanLink>
      </div>
    </div>
  );
};

const FileScanError = (event: {
  kind: Event.FILE_SCAN_ERROR;
  payload: Payload[Event.FILE_SCAN_ERROR];
}) => {
  return (
    <>
      <div className="flex gap-2">
        <div className="stat-title">File: {event.payload.id} </div>

        <div></div>
      </div>

      <div className="flex gap-2">
        <div className="stat-title">Viruses: </div>
        <div>
          {(event.payload?.data?.Viruses || []).map((virus) => (
            <div key={`virus_${virus}`}>{virus}</div>
          ))}
        </div>
      </div>
    </>
  );
};

const FileScanOk = (event: {
  kind: Event.FILE_SCAN_OK;
  payload: Payload[Event.FILE_SCAN_OK];
}) => {
  return (
    <div className="flex gap-2">
      <div className="stat-title">File: {event.payload.id} </div>

      <div></div>
    </div>
  );
};

const NewDebitNoteEvent = (event: {
  kind: Event.NEW_DEBIT_NOTE;
  payload: Payload[Event.NEW_DEBIT_NOTE];
}) => {
  return (
    <>
      {true ? (
        <>
          <div className="flex gap-2">
            <div className="stat-title">ID:</div>
            <div>
              <ShortLink id={event.payload.debitNoteId}></ShortLink>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="stat-title">Agreement ID:</div>
            <div>
              <ShortLink id={event.payload.agreementId}></ShortLink>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="stat-title">Amount </div>
            <div>
              <GLMAmountStat
                amount={formatBalance(parseEther(event.payload.totalAmountDue))}
              ></GLMAmountStat>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
};

export const EventCard = (
  event: EventType & {
    isExpanded: boolean;
    toggleExpanded: () => void;
  }
) => {
  return (
    <motion.div variants={variants} initial="hidden" animate="visible">
      {(() => {
        switch (event.kind) {
          case Event.ALLOCATION_CREATED:
            return (
              <EventCardScaffold
                event={event}
                template={<AllocationCreatedEvent {...event} />}
              />
            );
          case Event.ALLOCATION_RELEASED:
            return (
              <EventCardScaffold
                event={event}
                template={<AllocationReleasedEvent {...event} />}
              />
            );
          case Event.DEPOSIT_CREATED:
            return (
              <EventCardScaffold
                event={event}
                template={<DepositCreatedEvent {...event} />}
              />
            );
          case Event.DEPOSIT_EXTENDED:
            return (
              <EventCardScaffold
                event={event}
                template={<DepositExtendedEvent {...event} />}
              />
            );
          case Event.AGREEMENT_SIGNED:
            return (
              <EventCardScaffold
                event={event}
                template={<AgreementCreatedEvent {...event} />}
              />
            );
          case Event.AGREEMENT_TERMINATED:
            return (
              <EventCardScaffold
                event={event}
                template={<AgreementTerminatedEvent {...event} />}
              />
            );
          case Event.NEW_INVOICE:
            return (
              <EventCardScaffold
                event={event}
                template={<NewInvoiceEvent {...event} />}
              />
            );
          case Event.DEPOSIT_FEE_PAYMENT:
            return (
              <EventCardScaffold
                event={event}
                template={<DepositFeePaymentEvent {...event} />}
              />
            );
          case Event.DEPOSIT_PROVIDER_PAYMENT:
            return (
              <EventCardScaffold
                event={event}
                template={<DepositProviderPaymentEvent {...event} />}
              />
            );
          case Event.FILE_SCAN_ERROR:
            return (
              <EventCardScaffold
                event={event}
                template={<FileScanError {...event} />}
                color="#F66A6A"
              />
            );
          case Event.FILE_SCAN_OK:
            return (
              <EventCardScaffold
                event={event}
                template={<FileScanOk {...event} />}
                color="#5BC281"
              />
            );
          case Event.NEW_DEBIT_NOTE:
            return (
              <EventCardScaffold
                event={event}
                template={<NewDebitNoteEvent {...event} />}
              />
            );
        }
      })()}
    </motion.div>
  );
};
