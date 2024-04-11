import { config } from "config";
import { AnimatePresence, motion } from "framer-motion";
import { useAllowance } from "hooks/GLM/useGLMApprove";
import { formatEther } from "viem";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useUserCurrentDeposit } from "hooks/depositContract/useDeposit";
import { Button, Input } from "react-daisyui";
export const DepositSummary = ({ isVisible }: { isVisible: boolean }) => {
  const { data } = useUserCurrentDeposit();
  console.log("data", data);
  if (!data?.amount) {
    throw new Error("No deposit found");
  }
  return (
    <AnimatePresence>
      {isVisible && (
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
              className="h-8 inline"
              style={{
                color: "#00ff003c",
              }}
            />{" "}
            <span
              style={{
                color: "#0C14D4f3",
              }}
            >
              Deposit Summary
            </span>
          </h3>
          <br></br>
          <div className="text-sm flex flex-col justify-between">
            <div>
              <span>Amount: </span>
              <span>{formatEther(data.amount)}</span>
            </div>
            <div className="mt-4">
              <Button
                size="sm"
                color="primary"
                className="mr-2 px-6"
                onClick={() => {
                  console.log("Approve");
                }}
              >
                top up
              </Button>
              <Input
                size="sm"
                placeholder="Enter amount"
                className="w-40"
                type="number"
              ></Input>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
