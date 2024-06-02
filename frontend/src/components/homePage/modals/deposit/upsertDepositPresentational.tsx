import { GLMAmountInput } from "components/molecules/glmAmountInput/glmAmountInput";
import dayjs from "dayjs";
import { ChangeEvent, useEffect } from "react";
import { Button, Input, Loading } from "react-daisyui";
import { RPC_ERROR_CONTEXT } from "hooks/useHandleRpcError";
import { use } from "i18next";
export const UpsertDepositPresentational = ({
  title,
  subtitle,
  amount,
  setAmount,
  fee,
  setFee,
  validToTimestamp,
  setValidToTimestamp,
  callContract,
  buttonText,
  isPending,
  errorContext,
}: {
  title: string;
  subtitle: string;
  amount: number;
  setAmount: (amount: number) => void;
  fee: number;
  setFee: (fee: number) => void;
  validToTimestamp: number;
  setValidToTimestamp: (timestamp: number) => void;
  callContract: () => void;
  buttonText: string;
  isPending: boolean;
  errorContext?: RPC_ERROR_CONTEXT[];
}) => {
  useEffect(() => {
    console.log("validToTimestamp", validToTimestamp);
    console.log("s", dayjs(validToTimestamp * 1000).format("YYYY-MM-DD"));
  }, [validToTimestamp]);
  return (
    <>
      <div className="flex flex-row justify-between w-full">{title}</div>
      <div className="w-[40vw] mb-4">{subtitle}</div>
      <div className="grid grid-cols-3 gap-4">
        <GLMAmountInput
          amount={0}
          setAmount={setAmount}
          placeholder="amount"
          className={
            errorContext?.includes(RPC_ERROR_CONTEXT.amount)
              ? "input-error"
              : ""
          }
        />
        <GLMAmountInput
          amount={0}
          setAmount={setFee}
          placeholder="fee"
          className={
            errorContext?.includes(RPC_ERROR_CONTEXT.fee) ? "input-error" : ""
          }
        />
        <Input
          type="date"
          placeholder="Valid to timestamp"
          value={dayjs(validToTimestamp * 1000).format("YYYY-MM-DD")}
          onChange={(e: ChangeEvent) => {
            const target = e.target as HTMLInputElement;
            setValidToTimestamp(dayjs(target.value).unix());
          }}
          style={{
            color: "gray",
          }}
          className={
            errorContext?.includes(RPC_ERROR_CONTEXT.valid_to)
              ? "input-error"
              : ""
          }
        />
        <div></div>
        <div></div>
        <Button
          onClick={async () => {
            await callContract();
          }}
          className=" !text-white border-none text-lg font-light ring-0"
        >
          {isPending ? <Loading variant="infinity" /> : <>{buttonText}</>}
        </Button>{" "}
      </div>
    </>
  );
};
