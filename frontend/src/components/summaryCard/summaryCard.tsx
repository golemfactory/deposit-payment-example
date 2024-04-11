import { AnimatePresence } from "framer-motion";
import styles from "./summaryCard.module.css";
import { PropsWithChildren } from "react";

export const SummaryCard = ({
  isVisible,
  children,
}: PropsWithChildren<{ isVisible: boolean }>) => {
  return (
    <AnimatePresence>
      {isVisible && <div className={styles.summaryCard}>{children}</div>}
    </AnimatePresence>
  );
};
