import { AllocationLink } from "components/alloctionLink";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { useCreateAllocationEvents } from "hooks/events/useCreateAllocationEvents";
import { useReleaseAllocationEvents } from "hooks/events/useReleaseAllocationEvents";
import { useCreateAllocation } from "hooks/useCreateAllocation";
import { useCurrentAllocation } from "hooks/useCurrentAllocation";
import { useReleaseAllocation } from "hooks/useReleaseAllocation";
import { useUser } from "hooks/useUser";
import { Loading } from "react-daisyui";
import { Event } from "types/events";
import { formatBalance } from "utils/formatBalance";
import { parseEther } from "viem";

export const Allocation = () => {
  const { isCreating: isCreatingAllocation, createAllocation } =
    useCreateAllocation();
  const { currentAllocation } = useCurrentAllocation();
  const { releaseAllocation } = useReleaseAllocation();
  const { user } = useUser();

  console.log("currentAllocation", currentAllocation);

  return (
    <div className="stats shadow mt-2 ">
      <div
        className="stat "
        style={{
          opacity: user.hasDeposit() ? 1 : 0.3,
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
          opacity: user.hasDeposit() ? 1 : 0.3,
        }}
      >
        <div className="stat-title">Total</div>
        <GLMAmountStat amount={formatBalance(currentAllocation?.totalAmount)} />
      </div>
      <div
        className="stat "
        style={{
          opacity: user.hasDeposit() ? 1 : 0.3,
        }}
      >
        <div className="stat-title">Spent</div>
        <div className="stat-value">
          <GLMAmountStat
            amount={formatBalance(currentAllocation?.spentAmount)}
          />
        </div>
      </div>
      <div
        className="stat "
        style={{
          opacity: user.hasDeposit() ? 1 : 0.3,
        }}
      >
        <div className="stat-title">Remaining</div>
        <div className="stat-value">
          <GLMAmountStat
            amount={formatBalance(currentAllocation?.remainingAmount)}
          />
        </div>
      </div>
      <div
        className="stat "
        style={{
          opacity: 1,
        }}
      >
        <div
          className="stat-actions m-0"
          style={{
            opacity: user.hasDeposit() ? 1 : 0.3,
          }}
        >
          {isCreatingAllocation ? (
            <button
              className="btn"
              onClick={() => {
                createAllocation();
              }}
            >
              <Loading variant="infinity" />
            </button>
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
  );
};
