import { GLMAmountInput } from "components/molecules/glmAmountInput/glmAmountInput";
import dayjs from "dayjs";
import { ChangeEvent } from "react";
import { Button, Input, Loading } from "react-daisyui";

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
}) => {
  return (
    <>
      <div className="flex flex-row justify-between w-full">{title}</div>
      <div className="w-[40vw] mb-4">{subtitle}</div>
      <div className="grid grid-cols-3 gap-4">
        <GLMAmountInput amount={0} setAmount={setAmount} placeholder="amount" />
        <GLMAmountInput amount={0} setAmount={setFee} placeholder="fee" />
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
