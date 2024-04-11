import { config } from "config";
import { AnimatePresence, motion } from "framer-motion";
import { useAllowance } from "hooks/GLM/useGLMApprove";
import { formatEther } from "viem";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
export const AllowanceSummary = ({ isVisible }: { isVisible: boolean }) => {
  const { data } = useAllowance();
  return (
    <div
      style={{
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
        Allowance Summary
      </h3>
      <p>
        Left: {Number(formatEther(data || 0n)).toFixed(3)} GLM (minial :{" "}
        {formatEther(config.minimalAllowance)})
      </p>
      <p>Spent: x GLM </p>
    </div>
  );
};
