import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import { useCreateDeposit } from "hooks/depositContract/useDeposit";
import { useSaveDeposit } from "hooks/useSaveDeposit";

import { useEffect, useState } from "react";
import { Button, Card, Input, Loading } from "react-daisyui";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";

export const CreateDepositForm = ({ isVisible }: { isVisible: boolean }) => {
  const {
    data,
    createDeposit,
    setFee,
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

  const {
    saveDeposit,
    isSuccess: isSuccessSaveDeposit,
    isError: isErrorSaveDeposit,
  } = useSaveDeposit();
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

  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isPending) {
      setIsProcessing(true);
    }

    if (isErrorSaveDeposit || isSuccessSaveDeposit) {
      setIsProcessing(false);
    }
  }, [isPending, isErrorSaveDeposit, isSuccessSaveDeposit]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card
            style={{
              borderColor: "#ffffff14",
              fontFamily: "Kanit-Light",
              backgroundColor: "#0000005b",
              scale: "1",
            }}
          >
            <Card.Body>
              <Card.Title tag="h2">Deposit needed</Card.Title>
              <Card.Title tag="h4"></Card.Title>
              <Card.Body>
                <div className="w-[40vw] mb-4">
                  In order to pay for the service deposit in GLMs is needed. We
                  intentionally render here form with fee and valid to timestamp
                  for idea presentation purposes (try to set fee smaller than
                  10% of amount) In real world scenario both fee and valid to
                  timestamp should be calculated by the backend.
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    className="inline"
                    placeholder="Amount"
                    bordered={true}
                    onChange={(e) => {
                      setAmount(Number(e.target.value));
                    }}
                    style={{
                      color: "gray",
                    }}
                  />
                  <Input
                    className="inline"
                    placeholder="Fee"
                    onChange={(e) => {
                      setFee(Number(e.target.value));
                    }}
                    style={{
                      color: "gray",
                    }}
                  />
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
              </Card.Body>

              <Card.Actions className="justify-end">
                <Button
                  onClick={async () => {
                    const { nonce } = await createDeposit();
                    setNonce(nonce);
                  }}
                  className="bg-primary !text-white border-none text-lg font-light "
                  style={{
                    backgroundColor: "#181ea9a6",
                  }}
                >
                  {isProcessing ? (
                    <Loading variant="infinity" />
                  ) : (
                    "Make deposit"
                  )}
                </Button>{" "}
              </Card.Actions>
            </Card.Body>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
