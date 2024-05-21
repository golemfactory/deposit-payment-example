import { AnimatePresence, motion } from "framer-motion";
import { formatEther } from "viem";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useUserCurrentDeposit } from "hooks/depositContract/useDeposit";
import { Button, Input } from "react-daisyui";
import dayjs from "dayjs";
import { snapshot } from "viem/actions";
export const DepositSummary = ({
  showExtendDeposit,
}: {
  showExtendDeposit: () => void;
}) => {
  const readDepositResult = useUserCurrentDeposit();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "absolute",
        backgroundColor: "#0000005b",
        borderRadius: "16px",
        padding: "1rem",
        fontSize: "1.3rem",
        minWidth: "350px",
      }}
    >
      <h3>
        <CheckCircleIcon
          className="h-8 inline mb-1 mr-2"
          style={{
            color: "#00ff003c",
          }}
        />{" "}
        <span>Deposit created</span>
      </h3>
      <br></br>
      <div className="text-sm flex flex-col justify-between">
        <div>
          <div>
            <span className="text-lg">Amount: </span>
            <span>{readDepositResult.amount}</span>
          </div>
          <div>
            <span className="text-lg">Fee: </span>
            <span>{readDepositResult.flatFeeAmount}</span>
          </div>
          <div>
            <span className="text-lg">Valid to: </span>
            <span>
              {dayjs(readDepositResult.validToTimestamp * 1000).toString()}
            </span>
          </div>
        </div>
        <div className="mt-4">
          <Button
            size="sm"
            style={{
              backgroundColor: "#181ea9a6",
            }}
            className="mr-2 px-6 bg-golemblue-transparent border-none"
            onClick={() => {
              showExtendDeposit();
            }}
          >
            Extend
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
