import dayjs from "dayjs";
import {
  useExtendDeposit,
  useUserCurrentDeposit,
} from "hooks/depositContract/useDeposit";
import { useUser } from "hooks/useUser";
import { useEffect } from "react";
import { Button, Input, Loading } from "react-daisyui";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useTopUpAllocation } from "hooks/useTopUpAllocation";
import { GolemCoinIcon } from "./atoms/golem.coin.icon";
import { match, P } from "ts-pattern";

export const DepositForm = ({ mode }: { mode: "create" | "extend" }) => {
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
  // useEffect(() => {
  //   if (isSuccessTransaction) {
  //     hide();
  //   }
  // }, [isSuccessTransaction]);

  const { address } = useAccount();
  if (!address) {
    throw new Error("Address not found");
  }

  return (
    <>
      <div className="flex flex-row justify-between w-full">
        {match(mode)
          .with("create", () => (
            <h1 className="text-2xl font-semibold">Create deposit</h1>
          ))
          .with("extend", () => (
            <h1 className="text-2xl font-semibold">Extend deposit</h1>
          ))
          .exhaustive()}
      </div>
      <div className="w-[40vw] mb-4">
        {match(mode)
          .with("create", () => <div> Deposit creation text here </div>)
          .with("extend", () => <div> Deposit extension text here </div>)
          .exhaustive()}
      </div>
      <div className="grid grid-cols-3 gap-4">
        <label className="input input-bordered flex items-center gap-4 ">
          <input
            className="w-[75%]"
            type="number"
            min={0}
            autoFocus={true}
            placeholder="Amount"
            onChange={(e) => {
              setAdditionalAmount(Number(e.target.value));
            }}
          />{" "}
          <GolemCoinIcon />
        </label>
        <label className="input input-bordered flex items-center gap-4">
          <input
            className="w-[75%]"
            type="number"
            min={0}
            autoFocus={true}
            placeholder="Fee"
            onChange={(e) => {
              setAdditionalFee(Number(e.target.value));
            }}
          />{" "}
          <GolemCoinIcon />
        </label>
        <Input
          type="date"
          placeholder="Valid to timestamp"
          //@ts-ignore
          value={dayjs(Number(newValidToTimeStamp) * 1000).format("YYYY-MM-DD")}
          onChange={(e) => {
            console.log("e.target.value", e.target.value);
            setNewValidToTimestamp(dayjs(e.target.value).unix());
          }}
          style={{
            color: "gray",
          }}
        />
        <div></div>
        <div></div>
        <Button
          onClick={async () => {
            await extendDeposit();
          }}
          className=" !text-white border-none text-lg font-light ring-0"
        >
          {isPending || isLoadingTransaction || isAmendingAllocation ? (
            <Loading variant="infinity" />
          ) : (
            "Extend deposit"
          )}
        </Button>{" "}
      </div>
    </>
  );
};
