import { ApproveForm } from "components/homePage/modals/approveForm";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { useLayout } from "components/providers/layoutProvider";
import { useAllowanceTx } from "hooks/GLM/useAllowanceTx";
import { useUser } from "hooks/useUser";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-daisyui";
import { formatBalance } from "utils/formatBalance";
import { shortTransaction } from "utils/shortTransaction";
import { Bip } from "components/atoms/bip";

export const Approve = () => {
  const { txHash } = useAllowanceTx();

  const { user } = useUser();
  const { setModalContent, openModal } = useLayout();
  const openExtendApproveModal = useCallback(() => {
    setModalContent(<ApproveForm />);
    openModal();
  }, []);
  const [isApproveButtonActive, setIsApproveButtonActive] = useState(false);

  useEffect(() => {
    setIsApproveButtonActive(user.isRegistered() && !user.hasEnoughAllowance());
  }, [user.hasEnoughAllowance(), user.isRegistered()]);
  return (
    <div
      className="stats shadow mt-2 pb-4 pt-4"
      style={{
        opacity: user.isRegistered() ? 1 : 0.3,
      }}
    >
      <div className="stat">
        <div className="stat-title">Approve</div>
        <div className="stat-value">
          {user.hasEnoughAllowance()
            ? "OK"
            : user.allowanceAmount && user.allowanceAmount > 0
              ? "Not enough"
              : "-"}
        </div>
      </div>
      <div className="stat">
        <div className="stat-title">Given</div>
        <GLMAmountStat
          amount={
            user.allowanceAmount ? formatBalance(user.allowanceAmount) : ""
          }
        />
      </div>
      <div className="stat ">
        {txHash && (
          <>
            <div className="stat-title">Tx</div>
            <div className="state-content">
              <Link
                href={`https://holesky.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noreferrer"
              >
                {shortTransaction(txHash)}
              </Link>
            </div>
          </>
        )}
      </div>
      <div className="stat "></div>
      <div className="stat ">
        <div className="stat-actions mt-0 ">
          <button
            className="relative btn border-solid"
            onClick={openExtendApproveModal}
          >
            {isApproveButtonActive && <Bip />}
            {user.hasEnoughAllowance()
              ? "Extend"
              : user.allowanceAmount && user.allowanceAmount > 0
                ? "Extend"
                : "Approve"}
          </button>
        </div>
      </div>
      <div
        className="stat p-0 w-0"
        style={{
          opacity: user.hasAllocation() ? 1 : 0.3,
          width: "0px",
        }}
      ></div>{" "}
    </div>
  );
};
