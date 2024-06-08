import { useUser } from "hooks/useUser";
import { useEffect, useState } from "react";
import { useCreateAgreement } from "hooks/yagna/useCreateAgreement";
import { useReleaseAgreement } from "hooks/yagna/useReleaseAgreement";
import { ShortLink } from "components/shortLink";
import { useDebitNoteEvents } from "hooks/events/useYagnaEvents";
import { formatBalance } from "utils/formatBalance";
import { parseEther } from "viem";
import { GLMAmountStat } from "components/atoms/GLMAmount";
export const Agreement = () => {
  const { user } = useUser();
  const { createAgreement } = useCreateAgreement();
  const { releaseAgreement } = useReleaseAgreement();
  const { events$ } = useDebitNoteEvents();
  const [totalAmount, setTotalAmount] = useState("-");
  useEffect(() => {
    events$.subscribe((event: any) => {
      setTotalAmount(event.payload.totalAmountDue);
    });
  }, []);
  return (
    <div
      className="stats shadow mt-2"
      style={{
        opacity: user.hasAllocation() ? 1 : 0.3,
      }}
    >
      <div className="stat">
        <div className="stat-title">Agreement</div>
        <div className="stat-value">
          {user.currentAgreement?.id ? (
            <ShortLink id={user?.currentAgreement?.id}></ShortLink>
          ) : (
            "-"
          )}
        </div>
      </div>

      <div className="stat">
        <div className="stat-title">Total</div>
        <div className="stat-value">
          {user.currentAgreement?.id ? (
            <GLMAmountStat
              amount={formatBalance(parseEther(totalAmount))}
            ></GLMAmountStat>
          ) : (
            "-"
          )}
        </div>
      </div>
      <div className="stat"></div>
      <div className="stat">
        {/* <div className="stat-title">Amount spent</div>
              <div className="stat-value"></div> */}
      </div>
      <div className="stat ">
        <div className="stat-actions">
          {user.currentAgreement?.id &&
          user.currentAgreement?.state === "Approved" ? (
            <button
              className="btn"
              onClick={() => {
                //@ts-ignore
                releaseAgreement(user.currentAgreement?.id);
              }}
            >
              Terminate
            </button>
          ) : (
            <button
              className="btn"
              {...(user.hasAllocation() ? {} : { disabled: true })}
              onClick={() => {
                createAgreement();
              }}
            >
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
