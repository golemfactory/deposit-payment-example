import { Event } from "types/events";
import { useEvents } from "./useEvents";
import { useWatchContractEvent } from "wagmi";
import { abi } from "hooks/depositContract/abi";
import { config } from "config";
import { holesky } from "viem/chains";
import { merge } from "rxjs";

const depositEventToEventKind = (depositEvent: string): Event => {
  switch (depositEvent) {
    case "DepositFeeTransfer":
      return Event.DEPOSIT_FEE_PAYMENT;
    case "DepositTransfer":
      return Event.DEPOSIT_PROVIDER_PAYMENT;
    default:
      throw new Error(`Unknown deposit event: ${depositEvent}`);
  }
};
const useDepositEvent = ({
  depositEvent,
}: {
  depositEvent: "DepositFeeTransfer" | "DepositTransfer";
}) => {
  const { events$, emit } = useEvents({
    key: `${depositEvent}Events`,
    eventKind: depositEventToEventKind(depositEvent),
  });

  useWatchContractEvent({
    address: config.depositContractAddress[holesky.id],
    abi: abi,
    eventName: depositEvent,
    onLogs: (logs: any) => {
      logs.forEach((log: any) => {
        emit({
          txHash: log.transactionHash,
          amount: log.args.amount,
          fee: log.args.fee,
          validityTimestamp: log.args.validToTimestamp,
        });
      });
    },
  });
  return {
    events$,
  };
};

export const useDepositPaymentEvents = () => {
  const { events$: feeTransferEvents$ } = useDepositEvent({
    depositEvent: "DepositFeeTransfer",
  });
  const { events$: depositTransferEvents$ } = useDepositEvent({
    depositEvent: "DepositTransfer",
  });

  return {
    events$: merge(feeTransferEvents$, depositTransferEvents$),
  };
};
