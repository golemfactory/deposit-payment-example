import { AllocationLink } from "components/alloctionLink";
import { useCreateAllocationEvents } from "hooks/events/useCreateAllocationEvents";
import { useReleaseAllocationEvents } from "hooks/events/useReleaseAllocationEvents";
import { useCreateAllocation } from "hooks/useCreateAllocation";
import { useCurrentAllocation } from "hooks/useCurrentAllocation";
import { useReleaseAllocation } from "hooks/useReleaseAllocation";
import { useUser } from "hooks/useUser";
import { Event } from "types/events";
import { formatBalance } from "utils/formatBalance";

export const Allocation = () => {
  const { isCreating: isCreatingAllocation, createAllocation } =
    useCreateAllocation();
  const { currentAllocation } = useCurrentAllocation();
  const { releaseAllocation } = useReleaseAllocation();
  const { user } = useUser();
  const { emit: emitCreateAllocation } = useCreateAllocationEvents();
  const { emit: emitReleaseAllocation } = useReleaseAllocationEvents();
  return (
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
          {currentAllocation?.remainingAmount
            ? formatBalance(currentAllocation?.remainingAmount)
            : "-"}
        </div>
      </div>
      <div
        className="stat "
        style={{
          opacity: 1,
        }}
      >
        <div className="stat-actions m-0">
          <button
            className="btn"
            onClick={() => {
              emitReleaseAllocation({
                allocationId: "123",
              });
            }}
          >
            {" "}
            Create{" "}
          </button>
          <button
            className="btn"
            onClick={() => {
              emitCreateAllocation({
                amount: 100,
                allocationId: "123",
                validityTimestamp: Date.now() + 1000 * 60 * 60 * 24 * 30,
              });
            }}
          >
            {" "}
            Create{" "}
          </button>
          {/* {isCreatingAllocation ? (
            <Loading variant="infinity" />
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
          )} */}
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
