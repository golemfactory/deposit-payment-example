import { motion } from "framer-motion";
import { useUser } from "hooks/useUser";
import { AllowanceSummary } from "./allowanceSummary";
import { ApproveForm } from "./approveForm";
import { CreateDepositForm } from "./createDepositForm";
import { DepositSummary } from "./depositSummary";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ExtendDepositForm } from "./extendDepositForm";

const variants = {
  onTop: {
    top: "355px",
    left: "30px",
  },
  onCenter: {
    top: "30vh",
    left: "30vw",
  },
};

export const Deposit = ({
  isExtendFormVisible,
  showExtendForm,
  hideExtendForm,
}: {
  isExtendFormVisible: boolean;
  showExtendForm: () => void;
  hideExtendForm: () => void;
}) => {
  const { user } = useUser();
  const { address } = useAccount();

  const [position, setPosition] = useState("onCenter");

  useEffect(() => {
    if (user.hasDeposit()) {
      setPosition("onTop");
    }
    if (isExtendFormVisible) {
      console.log("showExtendDepositForm");
      setPosition("onCenter");
    }
  }, [user.hasDeposit(), isExtendFormVisible]);
  return (
    <motion.div
      style={{
        position: "absolute",
      }}
      animate={position}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      {user.hasDepositDataLoaded() && address && (
        <>
          <CreateDepositForm
            isVisible={user.hasDepositDataLoaded() && !user.hasDeposit()}
          />
          <ExtendDepositForm
            isVisible={isExtendFormVisible}
            hide={hideExtendForm}
          />
        </>
      )}

      {user.hasDeposit() && !isExtendFormVisible && (
        <DepositSummary showExtendDeposit={showExtendForm} />
      )}
    </motion.div>
  );
};
