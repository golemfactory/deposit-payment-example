import React, { ReactNode } from "react";
import { GolemCoinIcon } from "./golem.coin.icon";

export const GLMAmountStat = ({ amount }: { amount?: string }) => {
  return (
    <div className="stat-value flex">
      <div className="leading-6">{amount ? `${amount} ` : "-"}</div>
      {amount ? <GolemCoinIcon className="ml-1" /> : null}
    </div>
  );
};
