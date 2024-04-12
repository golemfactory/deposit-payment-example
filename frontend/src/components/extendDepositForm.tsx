import dayjs from "dayjs";
import { AnimatePresence, motion } from "framer-motion";
import {
  useExtendDeposit,
  useUserCurrentDeposit,
} from "hooks/depositContract/useDeposit";
import { useUser } from "hooks/useUser";
import { useEffect } from "react";
import { Button, Card, Input, Loading } from "react-daisyui";
import { useAccount, useWaitForTransactionReceipt } from "wagmi";
import { XMarkIcon } from "@heroicons/react/16/solid";
export const ExtendDepositForm = ({
  isVisible,
  hide,
}: {
  isVisible: boolean;
  hide: () => void;
}) => {
  const {
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

  const { data: currentDeposit } = useUserCurrentDeposit();

  useEffect(() => {
    if (user.currentDeposit) {
      setNonce(user.currentDeposit?.nonce);
    }
  }, [isSuccessTransaction]);

  useEffect(() => {
    if (currentDeposit) {
      console.log("currentDeposit", currentDeposit);
      // @ts-ignore
      setNewValidToTimestamp(currentDeposit.validTo);
    }
  }, [currentDeposit]);

  useEffect(() => {
    if (isSuccessTransaction) {
      hide();
    }
  }, [isSuccessTransaction]);
  const { address } = useAccount();
  if (!address) {
    throw new Error("Address not found");
  }

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
              scale: "1.2",
            }}
          >
            <Card.Body>
              <Card.Title tag="h2">
                <div className="flex flex-row justify-between w-full">
                  <div>Extend deposit</div>
                  <XMarkIcon
                    onClick={() => {
                      hide();
                    }}
                    className="cursor-pointer w-8 h-8 text-white"
                  />
                </div>
              </Card.Title>

              <Card.Body>
                <div className="w-[40vw] mb-4">
                  Deposit is extendable at any time.
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <Input
                    className="inline"
                    placeholder="Additional amount"
                    bordered={true}
                    onChange={(e) => {
                      setAdditionalAmount(Number(e.target.value));
                    }}
                    style={{
                      color: "gray",
                    }}
                  />
                  <Input
                    className="inline"
                    placeholder="Additional Fee"
                    onChange={(e) => {
                      setAdditionalFee(Number(e.target.value));
                    }}
                    style={{
                      color: "gray",
                    }}
                  />
                  <Input
                    type="date"
                    placeholder="Valid to timestamp"
                    //@ts-ignore
                    value={dayjs(Number(newValidToTimeStamp) * 1000).format(
                      "YYYY-MM-DD"
                    )}
                    onChange={(e) => {
                      setNewValidToTimestamp(dayjs(e.target.value).unix());
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
                    await extendDeposit();
                  }}
                  className=" !text-white border-none text-lg font-light "
                  style={{
                    backgroundColor: "#181ea9a6",
                  }}
                >
                  {isPending || isLoadingTransaction ? (
                    <Loading variant="infinity" />
                  ) : (
                    "Extend deposit"
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
