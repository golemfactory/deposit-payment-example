import dayjs from "dayjs";
import { useCreateDeposit } from "hooks/depositContract/useDeposit";
import { useSaveDeposit } from "hooks/useSaveDeposit";

import { useEffect, useState } from "react";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { UpsertDepositPresentational } from "./upsertDepositPresentational";
import debug from "debug";
const log = debug("CreateDeposit");

export const CreateDeposit = () => {
  const {
    data,
    createDeposit,
    setFee,
    error: errorPrepareDeposit,
    setAmount,
    isPending,
    setValidToTimestamp,
    depositId,
    nonce,
  } = useCreateDeposit();

  const {
    isSuccess: isSuccessTransaction,
    isError: isErrorTransaction,
    isLoading: isLoadingTransaction,
    isPending: isPendingTransaction,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  const { saveDeposit } = useSaveDeposit();
  const { address } = useAccount();
  if (!address) {
    throw new Error("Address not found");
  }

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isSuccessTransaction) {
      setTimeout(() => {
        log("saving deposit", depositId);
        log("nonce", nonce);
        log("address", address);

        saveDeposit({
          nonce,
          id: depositId,
          funder: address,
        });
      }, 1000);
    }
  }, [isSuccessTransaction, isErrorTransaction, nonce, depositId]);

  return (
    <UpsertDepositPresentational
      amount={0}
      setAmount={setAmount}
      callContract={createDeposit}
      isPending={isPending || isLoadingTransaction}
      fee={0}
      setFee={setFee}
      title="Create Deposit"
      buttonText="Create"
      subtitle="Create a new deposit to start using app"
      validToTimestamp={dayjs().add(1, "day").unix()}
      setValidToTimestamp={setValidToTimestamp}
    ></UpsertDepositPresentational>
  );
};
