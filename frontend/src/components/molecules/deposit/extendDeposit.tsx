import dayjs from "dayjs";
import {
  useExtendDeposit,
  useUserCurrentDeposit,
} from "hooks/depositContract/useDeposit";
import { useTopUpAllocation } from "hooks/useTopUpAllocation";
import { useUser } from "hooks/useUser";
import { useEffect } from "react";
import { useWaitForTransactionReceipt } from "wagmi";
import { UpsertDepositPresentational } from "./upsertDepositPresentational";

export const ExtendDeposit = () => {
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
  const { trigger: topUp, isMutating: isAmendingAllocation } =
    useTopUpAllocation();
  useEffect(() => {
    if (user.currentDeposit) {
      setNonce(user.currentDeposit?.nonce);
    }
    if (isSuccessTransaction && additionalAmount > 0) {
      topUp(additionalAmount);
    }
  }, [isSuccessTransaction]);

  useEffect(() => {
    console.log("newValidToTimeStamp", newValidToTimeStamp);
    console.log(
      "dd",
      dayjs(Number(newValidToTimeStamp) * 1000).format("YYYY-MM-DD")
    );
  }, [newValidToTimeStamp]);

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
    ></UpsertDepositPresentational>
  );
};
