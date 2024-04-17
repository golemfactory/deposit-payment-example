import { AnimatePresence, motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { Button } from "react-daisyui";

export const GolemManagerSummary = ({ isVisible }: { isVisible: boolean }) => {
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
            Allocation created
            <Button>
              <span>View details</span>
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
