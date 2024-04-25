import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "./atoms/button";
import { useReleaseAllocation } from "hooks/useReleaseAllocation";
import { LoadingSpinner } from "./loadingSpinner";
import { useState } from "react";
import { Loading } from "react-daisyui";
import { useUser } from "hooks/useUser";
import { useReleaseAgreement } from "hooks/useReleaseAgreement";

export const GolemManagerSummary = ({ isVisible }: { isVisible: boolean }) => {
  const { releaseAllocation } = useReleaseAllocation();
  const [isClosingAllocation, setIsClosingAllocation] = useState(false);
  const [isClosingActivity, setIsClosingActivity] = useState(false);
  const { releaseAgreement } = useReleaseAgreement();
  const { user } = useUser();
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          style={{
            position: "absolute",
            backgroundColor: "#0000005b",
            borderRadius: "16px",
            padding: "1rem",
            fontSize: "1.3rem",
            minWidth: "350px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="inline">
            <CheckCircleIcon
              className="h-8 inline mb-1 mr-2"
              style={{
                color: "#00ff003c",
              }}
            />{" "}
            <>Allocation created</>
          </div>
          <div>
            <Button
              className="mt-4"
              onClick={() => {
                releaseAllocation();
                setIsClosingAllocation(true);
              }}
            >
              {isClosingAllocation ? (
                <Loading variant="infinity" />
              ) : (
                <span>Release allocation</span>
              )}
            </Button>
          </div>
          {user?.currentActivity?.id && (
            <div>
              <div className="inline">
                <CheckCircleIcon
                  className="h-8 inline mb-1 mr-2"
                  style={{
                    color: "#00ff003c",
                  }}
                />{" "}
                <>Has activity</>
              </div>
              <div>
                <Button
                  className="mt-4"
                  onClick={() => {
                    releaseAgreement();
                    setIsClosingActivity(true);
                  }}
                >
                  {isClosingActivity ? (
                    <Loading variant="infinity" />
                  ) : (
                    <span>Stop activity </span>
                  )}
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
