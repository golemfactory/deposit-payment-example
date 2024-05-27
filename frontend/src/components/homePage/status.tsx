import { ApproveForm } from "components/approveForm";
import { GolemCoinIcon } from "components/atoms/golem.coin.icon";
import { useLayout } from "components/providers/layoutProvider";
import { useUser } from "hooks/useUser";
import { useCallback } from "react";
import { Card, Stats } from "react-daisyui";
import { formatEther } from "viem";

export const Status = () => {
  console.log("render status");
  const { user } = useUser();
  const { setModalContent, openModal, isModalOpen } = useLayout();
  const openExtendApproveModal = useCallback(() => {
    console.log("isModalOpen", isModalOpen);
    setModalContent(<ApproveForm />);
    console.log("openExtendApproveModal");
    openModal();
  }, []);
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
                {user.hasEnoughAllowance() ? "OK" : "-"}
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">Given</div>
              <div className="stat-value flex">
                <div className="leading-6">
                  {user.allowanceAmount
                    ? `${formatEther(user.allowanceAmount)} `
                    : "-"}
                </div>
                <GolemCoinIcon className="ml-1" />
              </div>
            </div>
            <div className="stat "></div>
            <div className="stat "></div>
            <div className="stat ">
              <div className="stat-actions m-0">
                <button className="btn" onClick={openExtendApproveModal}>
                  Change
                </button>
              </div>
            </div>
          </div>
          <div className="stats shadow mt-2">
            <div className="stat">
              <div className="stat-title">Deposit</div>
              <div className="stat-value">OK</div>
            </div>

            <div className="stat">
              <div className="stat-title">Amount locked</div>
              <div className="stat-value">1200</div>
            </div>
            <div className="stat">
              <div className="stat-title">Fee locked</div>
              <div className="stat-value">1200</div>
            </div>
            <div className="stat">
              <div className="stat-title">Amount spent</div>
              <div className="stat-value">1200</div>
            </div>
            <div className="stat">
              <div className="stat-title">Fee spent</div>
              <div className="stat-value">1200</div>
            </div>
          </div>
          <div className="stats shadow mt-2 ">
            <div
              className="stat "
              style={{
                opacity: 0.3,
              }}
            >
              <div className="stat-title">Allocation </div>
              <div className="stat-value"> - </div>
            </div>
            <div
              className="stat "
              style={{
                opacity: 0.3,
              }}
            >
              <div className="stat-title">Given</div>
              <div className="stat-value">-</div>
            </div>
            <div className="stat "></div>
            <div className="stat "></div>
            <div
              className="stat "
              style={{
                opacity: 1,
              }}
            >
              <div className="stat-actions m-0">
                <button className="btn">Create </button>
              </div>
            </div>
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
