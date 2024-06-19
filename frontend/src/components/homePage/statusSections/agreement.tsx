import { useUser } from "hooks/useUser";
import { useEffect, useState } from "react";
import { useCreateAgreement } from "hooks/yagna/useCreateAgreement";
import { useReleaseAgreement } from "hooks/yagna/useReleaseAgreement";
import { ShortLink } from "components/atoms/shortLink";
import { useDebitNoteEvents } from "hooks/events/useYagnaEvents";
import { formatBalance } from "utils/formatBalance";
import { parseEther } from "viem";
import { GLMAmountStat } from "components/atoms/GLMAmount";
import { Loading, Tooltip } from "react-daisyui";
import { filter } from "rxjs";

export const Agreement = () => {
  const { user } = useUser();
  const { createAgreement, isCreating } = useCreateAgreement();
  const { releaseAgreement, isReleasing } = useReleaseAgreement();
  const { events$ } = useDebitNoteEvents();
  const [totalAmount, setTotalAmount] = useState("-");
  useEffect(() => {
    if (user.currentAgreement?.id) {
      console.log("fetching total amount");
      events$
        .pipe(
          filter((event: any) => {
            console.log(event, user.currentAgreement);
            return event.payload.agreementId === user.currentAgreement?.id;
          })
        )
        .subscribe((event: any) => {
          setTotalAmount(event.payload.totalAmountDue);
        });
    }
  }, [user]);

  return (
    <div
      className="stats shadow mt-2 pt-4 pb-4"
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
        <div className="stat-title">Due amount</div>
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
            <Tooltip
              className="bg-primary"
              message="Will trigger payment to the provider."
            >
              <button
                className="btn"
                onClick={() => {
                  //@ts-ignore
                  releaseAgreement(user.currentAgreement?.id);
                }}
              >
                {isReleasing ? <Loading variant="infinity" /> : "Release"}
              </button>
            </Tooltip>
          ) : (
            <button
              className="btn"
              {...(user.hasAllocation() ? {} : { disabled: true })}
              onClick={() => {
                createAgreement();
              }}
            >
              {isCreating ? <Loading variant="infinity" /> : "Create"}
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
