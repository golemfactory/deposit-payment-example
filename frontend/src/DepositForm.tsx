import { useEffect, useState } from "react";
import { Input, Card, Button } from "react-daisyui";
import dayjs from "dayjs";
import { useDeposit } from "hooks/depositContract/useDeposit";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { useSaveDeposit } from "hooks/useSaveDeposit";

export const DepositForm = () => {
  const {
    data,
    createDeposit,
    isSuccess,
    setFee,
    setAmount,
    setValidToTimestamp,
  } = useDeposit();

  const {
    isSuccess: isSuccessTransaction,
    isError: isErrorTransaction,
    isLoading,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  const { saveDeposit } = useSaveDeposit();
  const { address } = useAccount();
  const [nonce, setNonce] = useState(0);
  if (!address) {
    throw new Error("Address not found");
  }
  useEffect(() => {
    if (isSuccessTransaction) {
      setTimeout(() => {
        saveDeposit({
          nonce,
          funder: address,
        });
      }, 1000);
    }
  }, [isSuccessTransaction, nonce]);

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
          onClick={async () => {
            const { nonce } = await createDeposit();
            setNonce(nonce);
          }}
        >
          Deposit
        </Button>
      </div>
    </Card>
  );
};
