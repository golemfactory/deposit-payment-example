import { motion } from "framer-motion";
import { useUser } from "hooks/useUser";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { GolemManagerForm } from "./GolemManagerForm";
import { GolemManagerSummary } from "./GolemManagerSummary";

const variants = {
  onTop: {
    top: "585px",
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

export const GolemManager = () => {
  const { user } = useUser();
  const { address } = useAccount();

  const [position, setPosition] = useState("hidden");

  useEffect(() => {
    console.log("user", user, user.hasAllocation());
    if (user.hasAllocation()) {
      setPosition("onTop");
    } else {
      if (user.hasDeposit()) {
        setPosition("onCenter");
      }
    }
  }, [user.state]);

  return (
    <motion.div
      style={{
        position: "absolute",
      }}
      animate={position}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <GolemManagerForm isVisible={!user.hasAllocation()} />
      <GolemManagerSummary isVisible={user.hasAllocation()} />
    </motion.div>
  );
};
