import { motion } from "framer-motion";
import { useUser } from "hooks/useUser";
import { AllowanceSummary } from "./allowanceSummary";
import { ApproveForm } from "./approveForm";

const variants = {
  onTop: {
    top: "205px",
    left: "30px",
  },
  onCenter: {
    top: "30vh",
  },
};

export const Allowance = () => {
  const { user } = useUser();

  return (
    <motion.div
      style={{
        position: "absolute",
      }}
      animate={user.hasEnoughAllowance() ? "onTop" : "onCenter"}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <ApproveForm
        isVisible={user.hasKnownAllowance() && !user.hasEnoughAllowance()}
      />
      <AllowanceSummary
        isVisible={user.hasKnownAllowance() && user.hasEnoughAllowance()}
      />
    </motion.div>
  );
};
