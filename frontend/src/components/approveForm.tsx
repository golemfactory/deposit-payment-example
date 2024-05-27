import { config } from "config";
import { useApprove } from "hooks/GLM/useGLMApprove";
import { useUser } from "hooks/useUser";
import { Button, Loading } from "react-daisyui";
import { formatEther, parseEther } from "viem";
import { LoadingSpinner } from "./loadingSpinner";
import { useBalance } from "hooks/useBalance";
import { useState } from "react";
import { formatBalance } from "utils/formatBalance";
import { number } from "ts-pattern/dist/patterns";
import { GolemCoinIcon } from "./atoms/golem.coin.icon";

export const ApproveForm = () => {
  const { user } = useUser();
  const { approve, isProcessing } = useApprove();
  const { GLM } = useBalance();
  const [amount, setAmount] = useState(Number(formatBalance(GLM)));
  return (
    <div>
      In order to properly use the service you need to allow service <br /> to
      spend your GLM tokens.
      <div className="stats -pl-4 mt-2 w-full">
        <div className="stat pl-0">
          <div className="stat-title">Current</div>
          <div className="stat-value flex">
            <div className="leading-6">
              {formatEther(user.allowanceAmount || 0n)}{" "}
            </div>
            <GolemCoinIcon className="ml-1 " />
          </div>
        </div>

        <div className="stat">
          <div className="stat-title">Minimal</div>
          <div className="stat-value flex ">
            <div className="leading-6">
              {formatEther(config.minimalAllowance)}{" "}
            </div>
            <GolemCoinIcon className="ml-1" />
          </div>
        </div>
        <div className="stat"></div>
        <div className="stat">
          {/* <div className="stat-actions m-0">

          </div> */}
        </div>
      </div>
      <div className="flex">
        <label className="input input-bordered flex items-center gap-4 w-48">
          <input
            className="w-28"
            type="number"
            min={11}
            autoFocus={true}
            value={amount || ""}
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />{" "}
          <GolemCoinIcon />
        </label>

        <Button
          onClick={() => {
            approve(parseEther(amount.toString()));
          }}
          // disabled={isProcessing}
          className="btn ml-4"
        >
          {isProcessing ? <Loading variant="infinity" /> : "Approve"}
        </Button>
      </div>
      {/* {formatEther(user.allowanceAmount || 0n)} GLM. Minimal allowance amount is{" "}
      {formatEther(config.minimalAllowance)} GLM */}
    </div>
  );
};
