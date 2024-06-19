import { Event } from "types/events";
import { useEvents } from "./useEvents";
import { useWatchContractEvent } from "wagmi";
import { abi } from "hooks/depositContract/abi";
import { config } from "config";
import { holesky } from "viem/chains";
import { merge } from "rxjs";
import { useCallback } from "react";

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
  const { events$, emit, clean } = useEvents({
    key: `${depositEvent.toLowerCase()}Events`,
    eventKind: depositEventToEventKind(depositEvent),
  });

  const onLogs = useCallback((logs: any) => {
    logs.forEach((log: any) => {
      console.log("got e", log);
      const e = {
        txHash: log.transactionHash,
        amount: Number(log.args.amount),
        fee: Number(log.args.fee),
        validityTimestamp: Number(log.args.validToTimestamp),
        id: log.transactionHash,
      };
      emit(e);
    });
  }, []);

  useWatchContractEvent({
    abi: abi,
    eventName: depositEvent,
    onLogs,
    address: config.depositContractAddress[holesky.id],
  });
  return {
    events$,
    clean,
  };
};

export const useDepositPaymentEvents = () => {
  const { events$: feeTransferEvents$, clean: cleanFeeTransfer } =
    useDepositEvent({
      depositEvent: "DepositFeeTransfer",
    });
  const { events$: depositTransferEvents$, clean: cleanDepositTransfer } =
    useDepositEvent({
      depositEvent: "DepositTransfer",
    });

  return {
    events$: merge(feeTransferEvents$, depositTransferEvents$),
    clean: () => {
      cleanFeeTransfer();
      cleanDepositTransfer();
    },
  };
};
