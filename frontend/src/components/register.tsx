import { AnimatePresence, motion } from "framer-motion";
import { useUser } from "hooks/useUser";
import { AllowanceSummary } from "./allowanceSummary";
import { ApproveForm } from "./approveForm";
import { RegisterSummary } from "./registerSummary";
import { RegisterButton } from "./RegisterButton";

const variants = {
  onTop: {
    top: "120px",
    left: "30px",
  },
  onCenter: {
    top: "30vh",
  },
};

export const Register = () => {
  const { user } = useUser();
  return (
    <motion.div
      style={{
        position: "absolute",
      }}
      animate={user.isRegistered() ? "onTop" : "onCenter"}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <RegisterButton isVisible={!user.isRegistered() && user.isConnected()} />
      <RegisterSummary isVisible={user.isRegistered()} />
    </motion.div>
  );
};
