import { config } from "config";
import { AnimatePresence, motion } from "framer-motion";
import { useAllowance } from "hooks/GLM/useGLMApprove";
import { formatEther } from "viem";
import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { SummaryCard } from "./summaryCard/summaryCard";
export const AllowanceSummary = ({ isVisible }: { isVisible: boolean }) => {
  const { data } = useAllowance();
  return (
    <SummaryCard isVisible={isVisible}>
      <h3>
        <CheckCircleIcon
          className="h-8 inline mr-2 mb-1"
          style={{
            color: "#00ff003c",
          }}
        />{" "}
        Allowance Given
      </h3>
      <p className="text-sm flex flex-col justify-between mt-4">
        Left: {Number(formatEther(data || 0n)).toFixed(3)} GLM (minial :{" "}
        {formatEther(config.minimalAllowance)})
      </p>
      <p className="text-sm flex flex-col justify-between">Spent: x GLM </p>
    </SummaryCard>
  );
};
