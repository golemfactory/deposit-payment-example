import { useCreateDeposit } from "hooks/depositContract/useDeposit";
import { useSaveDeposit } from "hooks/useSaveDeposit";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { UpsertDepositPresentational } from "./upsertDepositPresentational";
import debug from "debug";
import { useLayout } from "components/providers/layoutProvider";
const log = debug("CreateDeposit");

export const CreateDeposit = () => {
  const { hideModal } = useLayout();

  const {
    createDeposit,
    setFee,
    setAmount,
    isPending,
    isSuccess,
    isError,
    isLoading,
    validToTimestamp,
    setValidToTimestamp,
    depositId,
    nonce,
    errorContext,
  } = useCreateDeposit();

  const { saveDeposit } = useSaveDeposit();
  const { address } = useAccount();

  if (!address) {
    throw new Error("Address not found");
  }

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        log("saving deposit", depositId);
        log("nonce", nonce);
        log("address", address);

        saveDeposit({
          nonce,
          id: depositId,
          funder: address,
        });

        hideModal();
      }, 1000);
    }
  }, [isSuccess, isError, nonce, depositId]);

  return (
    <UpsertDepositPresentational
      amount={0}
      setAmount={setAmount}
      callContract={createDeposit}
      isPending={isLoading}
      fee={0}
      setFee={setFee}
      title="Create Deposit"
      buttonText="Create"
      subtitle="Create a new deposit to start using app"
      validToTimestamp={validToTimestamp}
      setValidToTimestamp={setValidToTimestamp}
      errorContext={errorContext}
    ></UpsertDepositPresentational>
  );
};
