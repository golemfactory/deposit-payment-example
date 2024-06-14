import { ShortLink } from "components/atoms/shortLink";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { useCreateAllocation } from "hooks/yagna/useCreateAllocation";
import { useCurrentAllocation } from "hooks/yagna/useCurrentAllocation";
import { useReleaseAllocation } from "hooks/yagna/useReleaseAllocation";
import { useUser } from "hooks/useUser";
import { Loading } from "react-daisyui";
import { formatBalance } from "utils/formatBalance";

export const Allocation = () => {
  const { isCreating, createAllocation } = useCreateAllocation();
  const { currentAllocation } = useCurrentAllocation();
  const { releaseAllocation, isReleasing } = useReleaseAllocation();
  const { user } = useUser();

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
          <ShortLink id={currentAllocation?.id}></ShortLink>
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
          {isCreating ? (
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
              <button className="btn" onClick={() => releaseAllocation()}>
                {isReleasing ? <Loading variant="infinity" /> : "Release"}
              </button>
            </div>
          ) : (
            <button
              className="btn"
              {...(user.hasDeposit() ? {} : { disabled: true })}
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
