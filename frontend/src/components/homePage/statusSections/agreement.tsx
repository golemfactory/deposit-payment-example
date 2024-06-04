import { useLayout } from "components/providers/layoutProvider";
import { useUser } from "hooks/useUser";
import { useCallback } from "react";
import { useCreateAgreement } from "hooks/useCreateAgreement";
export const Agreement = () => {
  const { user } = useUser();
  const { setModalContent, openModal } = useLayout();
  const { createAgreement } = useCreateAgreement();
  return (
    <div
      className="stats shadow mt-2"
      style={{
        opacity: user.hasEnoughAllowance() ? 1 : 0.3,
      }}
    >
      <div className="stat">
        <div className="stat-title">Agreement</div>
      </div>

      <div className="stat"></div>
      <div className="stat"></div>
      <div className="stat">
        {/* <div className="stat-title">Amount spent</div>
              <div className="stat-value"></div> */}
      </div>
      <div className="stat ">
        <div className="stat-actions">
          <button
            className="btn"
            onClick={() => {
              createAgreement();
            }}
          >
            Create
          </button>
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
