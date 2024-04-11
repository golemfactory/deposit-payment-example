import { motion } from "framer-motion";
import { useUser } from "hooks/useUser";
import { AllowanceSummary } from "./allowanceSummary";
import { ApproveForm } from "./approveForm";
import { CreateDepositForm } from "./createDepositForm";
import { DepositSummary } from "./depositSummary";

const variants = {
  onTop: {
    top: "355px",
    left: "30px",
  },
  onCenter: {
    top: "30vh",
  },
};

export const Deposit = () => {
  const { user } = useUser();
  console.log("Deposit rendered", user.hasDeposit());
  return (
    <motion.div
      style={{
        position: "absolute",
      }}
      animate={user.hasDeposit() ? "onTop" : "onCenter"}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <CreateDepositForm
        isVisible={user.hasDepositDataLoaded() && !user.hasDeposit()}
      />
      <DepositSummary isVisible={user.hasDeposit()} />
    </motion.div>
  );
};
