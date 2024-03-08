import { useState } from "react";
import { Input, Card, Button } from "react-daisyui";
import dayjs from "dayjs";
import { useDeposit } from "hooks/depositContract/useDeposit";

window.day = dayjs;
export const DepositForm = () => {
  const { createDeposit, setFee, setAmount, setValidToTimestamp } =
    useDeposit();

  return (
    <Card>
      <div className="grid grid-cols-1 gap-4">
        <Input
          placeholder="Amount"
          bordered={true}
          onChange={(e) => {
            setAmount(Number(e.target.value));
          }}
        />
        <Input
          placeholder="Fee"
          onChange={(e) => {
            setFee(Number(e.target.value));
          }}
        />
        <Input
          type="date"
          placeholder="Valid to timestamp"
          onChange={(e) => {
            setValidToTimestamp(dayjs(e.target.value).unix());
          }}
        />
        <Button
          className="bg-golemblue text-lightblue-200 hover:bg-blue-400"
          onClick={createDeposit}
        >
          Deposit
        </Button>
      </div>
    </Card>
  );
};
