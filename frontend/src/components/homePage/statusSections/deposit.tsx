import { ApproveForm } from "components/homePage/modals/approveForm";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { CreateDeposit } from "components/homePage/modals/deposit/createDeposit";
import { ExtendDeposit } from "components/homePage/modals/deposit/extendDeposit";
import { useLayout } from "components/providers/layoutProvider";
import { useUserCurrentDeposit } from "hooks/depositContract/useDeposit";
import { useUser } from "hooks/useUser";
import { useCallback } from "react";
import { Loading } from "react-daisyui";
import { formatBalance } from "utils/formatBalance";

export const Deposit = () => {
  const { user } = useUser();
  const { setModalContent, openModal } = useLayout();

  const openExtendDepositModal = useCallback(() => {
    setModalContent(<ExtendDeposit />);
    openModal();
  }, []);

  const openCreateDepositModal = useCallback(() => {
    setModalContent(<CreateDeposit />);
    openModal();
  }, []);

  const deposit = useUserCurrentDeposit();
  return (
    <div
      className="stats shadow mt-2 pt-4 pb-4"
      style={{
        opacity: user.hasEnoughAllowance() ? 1 : 0.3,
      }}
    >
      <div className="stat">
        <div className="stat-title">Deposit</div>
        <div className="stat-value">
          {deposit.isPending ? (
            <Loading variant="infinity" />
          ) : user.hasDeposit() ? (
            "OK"
          ) : (
            "-"
          )}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Amount locked</div>
        <GLMAmountStat amount={formatBalance(deposit.amount)} />
      </div>
      <div className="stat">
        <div className="stat-title">Fee locked</div>
        <GLMAmountStat amount={formatBalance(deposit.flatFeeAmount)} />
      </div>
      <div className="stat">
        {/* <div className="stat-title">Amount spent</div>
              <div className="stat-value"></div> */}
      </div>
      <div className="stat ">
        <div className="stat-actions">
          {user.hasDeposit() ? (
            <button className="btn" onClick={openExtendDepositModal}>
              Extend
            </button>
          ) : (
            <button className="btn" onClick={openCreateDepositModal}>
              Create
            </button>
          )}
        </div>
      </div>
      <div
        className="stat p-0 w-0"
        style={{
          opacity: user.hasAllocation() ? 1 : 0.3,
          width: "0px",
        }}
      ></div>
    </div>
  );
};
