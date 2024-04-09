import { motion } from "framer-motion";
import { useAccount } from "wagmi";

const variants = {
  onTop: {
    top: "5vh",
    left: "5vw",
  },
  onCenter: {
    top: "50vh",
  },
};
export const ConnectWallet = () => {
  const { isConnected } = useAccount();
  return (
    <motion.div
      style={{
        position: "absolute",
      }}
      initial={{ top: "50vh" }}
      animate={isConnected ? "onTop" : "onCenter"}
      variants={variants}
      transition={{ duration: 0.5 }}
    >
      <w3m-button
        //@ts-ignore
        style={{
          scale: "1.4",
        }}
      ></w3m-button>
    </motion.div>
  );
};
