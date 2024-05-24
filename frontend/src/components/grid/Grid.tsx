import { PropsWithChildren } from "react";
import style from "./Grid.module.css";
export const Grid = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <div className={`${style.container} ${className}`}>
      <div className={style.golemGrid}>{children}</div>
    </div>
  );
};
