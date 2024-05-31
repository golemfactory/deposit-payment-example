import { AllocationLink } from "components/alloctionLink";
import { ApproveForm } from "components/approveForm";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { CreateDeposit } from "components/molecules/deposit/createDeposit";
import { ExtendDeposit } from "components/molecules/deposit/extendDeposit";
import { useLayout } from "components/providers/layoutProvider";
import { useAllowanceTx } from "hooks/GLM/useAllowanceTx";
import { useUserCurrentDeposit } from "hooks/depositContract/useDeposit";
import { useCreateAllocation } from "hooks/useCreateAllocation";
import { useCurrentAllocation } from "hooks/useCurrentAllocation";
import { useReleaseAllocation } from "hooks/useReleaseAllocation";
import { useUser } from "hooks/useUser";
import { useCallback } from "react";
import { Card, Link, Loading } from "react-daisyui";
import { formatBalance } from "utils/formatBalance";
import { shortTransaction } from "utils/shortTransaction";

export const Status = () => {
  const { user } = useUser();
  const { setModalContent, openModal, isModalOpen } = useLayout();
  const openExtendApproveModal = useCallback(() => {
    setModalContent(<ApproveForm />);
    openModal();
  }, []);

  const openExtendDepositModal = useCallback(() => {
    setModalContent(<ExtendDeposit />);
    openModal();
  }, []);

  const openCreateDepositModal = useCallback(() => {
    setModalContent(<CreateDeposit />);
    openModal();
  }, []);

  const deposit = useUserCurrentDeposit();

  const { isCreating: isCreatingAllocation, createAllocation } =
    useCreateAllocation();

  const { currentAllocation } = useCurrentAllocation();
  const { releaseAllocation } = useReleaseAllocation();
  const { txHash } = useAllowanceTx();
  return (
    <Card>
      <Card.Body>
        <Card.Title>Status</Card.Title>
        <div className="flex flex-col justify-between">
          <div className="stats shadow">
            <div className="stat ">
              <div className="stat-title">Registered</div>
              <div className="stat-value">
                {user.isRegistered() ? "OK" : "Not registered"}{" "}
              </div>
            </div>
          </div>
          <div className="stats shadow mt-2">
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
                amount={formatBalance(user.allowanceAmount || 0n)}
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
                <button className="btn" onClick={openExtendApproveModal}>
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
          <div className="stats shadow mt-2">
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
              <GLMAmountStat amount={deposit.amount} />
            </div>
            <div className="stat">
              <div className="stat-title">Fee locked</div>
              <GLMAmountStat amount={deposit.flatFeeAmount} />
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
          <div className="stats shadow mt-2 ">
            <div
              className="stat "
              style={{
                opacity: user.hasAllocation() ? 1 : 0.3,
              }}
            >
              <div className="stat-title">Allocation </div>
              <div className="stat-value">
                <AllocationLink
                  allocationId={user?.currentAllocation?.id}
                ></AllocationLink>
              </div>
            </div>
            <div
              className="stat "
              style={{
                opacity: user.hasAllocation() ? 1 : 0.3,
              }}
            >
              <div className="stat-title">Total</div>
              <div className="stat-value">
                {currentAllocation?.totalAmount || "-"}
              </div>
            </div>
            <div
              className="stat "
              style={{
                opacity: user.hasAllocation() ? 1 : 0.3,
              }}
            >
              <div className="stat-title">Spent</div>
              <div className="stat-value">
                {currentAllocation?.spentAmount || "-"}
              </div>
            </div>
            <div
              className="stat "
              style={{
                opacity: user.hasAllocation() ? 1 : 0.3,
              }}
            >
              <div className="stat-title">Remaining</div>
              <div className="stat-value">
                {currentAllocation?.remainingAmount || "-"}
              </div>
            </div>
            <div
              className="stat "
              style={{
                opacity: 1,
              }}
            >
              <div className="stat-actions m-0">
                {isCreatingAllocation ? (
                  <Loading />
                ) : user.hasAllocation() ? (
                  <div className="btn-group">
                    <button className="btn">Extend </button>
                    <button className="btn" onClick={() => releaseAllocation()}>
                      Close{" "}
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn"
                    onClick={() => {
                      createAllocation();
                    }}
                  >
                    Create{" "}
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
          <div className="stats shadow mt-2">
            <div className="stat " style={{ opacity: 0.3 }}>
              <div className="stat-title">Agreement</div>
              <div className="stat-value">-</div>
            </div>
            <div className="stat ">
              {/* <div className="stat-title">Given</div>
              <div className="stat-value">4200</div> */}
            </div>
            <div className="stat "></div>
            <div className="stat "></div>
            <div
              className="stat "
              style={{
                opacity: 0.3,
              }}
            >
              <div className="stat-actions m-0">
                <button className="btn">Create </button>
              </div>
            </div>{" "}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
