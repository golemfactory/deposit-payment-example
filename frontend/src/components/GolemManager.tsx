import { motion } from "framer-motion";
import { useUser } from "hooks/useUser";
import { useEffect, useState } from "react";
import { GolemManagerForm } from "./GolemManagerForm";
import { GolemManagerSummary } from "./GolemManagerSummary";

const variants = {
  onTop: {
    top: "615px",
    left: "30px",
    opacity: 1,
  },
  onCenter: {
    top: "30vh",
    left: "30vw",
    opacity: 1,
  },
  hidden: {
    opacity: 0,
  },
};

export const GolemManager = ({ isFormVisible }: { isFormVisible: boolean }) => {
  const { user } = useUser();

  const [position, setPosition] = useState("hidden");
  useEffect(() => {
    if (user.hasAllocation()) {
      setPosition("onTop");
    } else {
      if (user.hasDeposit()) {
        setPosition("onCenter");
      } else {
        setPosition("hidden");
      }
    }
  }, [user.hasDeposit(), user.hasAllocation()]);
  return (
    <motion.div
      style={{
        position: "absolute",
      }}
      animate={position}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <GolemManagerForm isVisible={isFormVisible && !user.hasAllocation()} />
      <GolemManagerSummary isVisible={user.hasAllocation()} />
    </motion.div>
  );
};
