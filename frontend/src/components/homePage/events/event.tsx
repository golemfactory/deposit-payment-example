import { Event, EventType, Payload } from "types/events";

import { Card } from "react-daisyui";

import { motion } from "framer-motion";
import { EtherScanLink } from "components/atoms/etherscanLink";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { formatBalance } from "utils/formatBalance";
import { parseEther } from "viem";
import dayjs from "dayjs";
import { ShortLink } from "components/atoms/shortLink";
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
          <div className="flex gap-2">
            <div className="stat-title"> Agreement ID: </div>{" "}
            <ShortLink id={event.payload.agreementId}></ShortLink>
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

const DepositProviderPaymentEvent = (event: {
  kind: Event.DEPOSIT_PROVIDER_PAYMENT;
  payload: Payload[Event.DEPOSIT_PROVIDER_PAYMENT];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Provider Payment</Card.Title>
        <div>
          <div className="flex gap-2">
            <div className="stat-title">TX Hash : </div>
            <EtherScanLink
              hash={event.payload.txHash}
              route="address"
            ></EtherScanLink>
          </div>
          <div className="flex gap-2">
            <div className="stat-title">Amount : </div>
            <GLMAmountStat
              amount={formatBalance(event.payload.amount)}
            ></GLMAmountStat>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const NewInvoiceEvent = (event: {
  kind: Event.NEW_INVOICE;
  payload: Payload[Event.NEW_INVOICE];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>New Invoice</Card.Title>
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
      </Card.Body>
    </Card>
  );
};

const DepositFeePaymentEvent = (event: {
  kind: Event.DEPOSIT_FEE_PAYMENT;
  payload: Payload[Event.DEPOSIT_FEE_PAYMENT];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Deposit Fee Payment</Card.Title>
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
      </Card.Body>
    </Card>
  );
};

const DepositProviderPayment = (event: {
  kind: Event.DEPOSIT_PROVIDER_PAYMENT;
  payload: Payload[Event.DEPOSIT_PROVIDER_PAYMENT];
}) => {
  return (
    <Card bordered={true}>
      <Card.Body>
        <Card.Title>Deposit Provider Payment</Card.Title>
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
      </Card.Body>
    </Card>
  );
};

const FileScanError = (event: {
  kind: Event.FILE_SCAN_ERROR;
  payload: Payload[Event.FILE_SCAN_ERROR];
}) => {
  return (
    <Card bordered={true} className="!bg-notistack-red">
      <Card.Body>
        <Card.Title>File Infected</Card.Title>
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
      </Card.Body>
    </Card>
  );
};

const FileScanOk = (event: {
  kind: Event.FILE_SCAN_OK;
  payload: Payload[Event.FILE_SCAN_OK];
}) => {
  return (
    <Card bordered={true} className="!bg-notistack-green">
      <Card.Body>
        <Card.Title>File Clean</Card.Title>
        <div className="flex gap-2">
          <div className="stat-title">File: {event.payload.id} </div>

          <div></div>
        </div>
      </Card.Body>
    </Card>
  );
};

const NewDebitNoteEvent = (event: {
  kind: Event.NEW_DEBIT_NOTE;
  payload: Payload[Event.NEW_DEBIT_NOTE];
}) => {
  return (
    <>
      {event.payload.paymentDueDate ? (
        <Card bordered={true}>
          <Card.Body>
            <Card.Title>New Payable Debit Note</Card.Title>
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
                  amount={formatBalance(
                    parseEther(event.payload.totalAmountDue)
                  )}
                ></GLMAmountStat>
              </div>
            </div>
          </Card.Body>
        </Card>
      ) : null}
    </>
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
          case Event.NEW_INVOICE:
            return <NewInvoiceEvent {...event} />;
          case Event.DEPOSIT_FEE_PAYMENT:
            return <DepositFeePaymentEvent {...event} />;
          case Event.DEPOSIT_PROVIDER_PAYMENT:
            return <DepositProviderPaymentEvent {...event} />;
          case Event.FILE_SCAN_ERROR:
            return <FileScanError {...event} />;
          case Event.FILE_SCAN_OK:
            return <FileScanOk {...event} />;
          case Event.NEW_DEBIT_NOTE:
            return <NewDebitNoteEvent {...event} />;
        }
      })()}
    </motion.div>
  );
};
