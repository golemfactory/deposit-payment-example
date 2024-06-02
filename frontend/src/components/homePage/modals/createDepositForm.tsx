import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useCreateDeposit } from "hooks/depositContract/useDeposit";
import { useSaveDeposit } from "hooks/useSaveDeposit";

import { useEffect, useState } from "react";
import { Button, Card, Input, Loading } from "react-daisyui";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { GLMAmountInput } from "./molecules/glmAmountInput/glmAmountInput";

export const CreateDepositForm = () => {
  const {
    data,
    createDeposit,
    setFee,
    error: errorPrepareDeposit,
    setAmount,
    isPending,
    setValidToTimestamp,
  } = useCreateDeposit();

  const {
    isSuccess: isSuccessTransaction,
    isError: isErrorTransaction,
    isLoading: isLoadingTransaction,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  const [nonce, setNonce] = useState(0);
  const [depositId, setDepositId] = useState("");
  const {
    saveDeposit,
    isSuccess: isSuccessSaveDeposit,
    isError: isErrorSaveDeposit,
  } = useSaveDeposit();
  const { address } = useAccount();
  if (!address) {
    throw new Error("Address not found");
  }

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    console.log("da", data);
  }, [data]);

  useEffect(() => {
    console.log("isSuccessTransaction", isSuccessTransaction);
    console.log("isErrorTransaction", isErrorTransaction);
    if (isSuccessTransaction) {
      setTimeout(() => {
        saveDeposit({
          nonce,
          id: depositId,
          funder: address,
        });
      }, 1000);
    }
  }, [isSuccessTransaction, isErrorTransaction, nonce]);

  useEffect(() => {
    if (isPending) {
      setIsProcessing(true);
    }

    if (isErrorSaveDeposit || isSuccessSaveDeposit) {
      setIsProcessing(false);
    }
  }, [isPending, isErrorSaveDeposit, isSuccessSaveDeposit]);

  return (
    <>
      <div className="w-[40vw] mb-4">
        In order to pay for the service deposit in GLMs is needed. We
        intentionally render here form with fee and valid to timestamp for idea
        presentation purposes (try to set fee smaller than 10% of amount) In
        real world scenario both fee and valid to timestamp should be calculated
        by the backend.
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex">
          <GLMAmountInput amount={0} setAmount={setAmount} />
          <GLMAmountInput amount={0} setAmount={setFee} />
          <Input
            type="date"
            placeholder="Valid to timestamp"
            onChange={(e) => {
              setValidToTimestamp(dayjs(e.target.value).unix());
            }}
            style={{
              color: "gray",
            }}
          />
        </div>
      </div>
    </>
  );
};
