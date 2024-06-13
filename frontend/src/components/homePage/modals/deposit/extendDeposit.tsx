import dayjs from "dayjs";
import {
  useExtendDeposit,
  useUserCurrentDeposit,
} from "hooks/depositContract/useDeposit";
import { useTopUpAllocation } from "hooks/yagna/useTopUpAllocation";
import { useUser } from "hooks/useUser";
import { useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { UpsertDepositPresentational } from "./upsertDepositPresentational";
import { useLayout } from "components/providers/layoutProvider";

export const ExtendDeposit = () => {
  const { hideModal } = useLayout();

  const {
    additionalAmount,
    data,
    extendDeposit,
    setAdditionalAmount,
    setNewValidToTimestamp,
    setAdditionalFee,
    setNonce,
    isPending,
    newValidToTimeStamp,
    errorContext,
  } = useExtendDeposit();

  const {
    isSuccess: isSuccessTransaction,
    isError: isErrorTransaction,
    isLoading: isLoadingTransaction,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  const { user } = useUser();

  const currentDeposit = useUserCurrentDeposit();

  const { trigger: topUp, isTopingUp } = useTopUpAllocation();

  useEffect(() => {
    if (user.currentDeposit) {
      setNonce(user.currentDeposit?.nonce);
    }
    if (isSuccessTransaction && additionalAmount > 0) {
      console.log("topping up", additionalAmount, isSuccessTransaction);
      topUp(additionalAmount);
      hideModal();
    }
  }, [isSuccessTransaction]);

  return (
    <UpsertDepositPresentational
      amount={additionalAmount}
      setAmount={setAdditionalAmount}
      callContract={extendDeposit}
      isPending={isPending || isLoadingTransaction}
      fee={0}
      setFee={setAdditionalFee}
      title="Extend deposit"
      buttonText="Extend"
      subtitle="Extend your deposit to increase your allocation"
      validToTimestamp={newValidToTimeStamp}
      setValidToTimestamp={setNewValidToTimestamp}
      errorContext={errorContext}
    ></UpsertDepositPresentational>
  );
};
