import { motion } from "framer-motion";
import { useEffect } from "react";
import { adjustShadowRootStyles, queryShadowRootDeep } from "utils/shadowRoot";
import { flareTestnet } from "viem/chains";
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

const pathToContent = [
  { selector: "w3m-button", useShadowRoot: true },
  { selector: "w3m-account-button", useShadowRoot: true },
  { selector: "wui-account-button", useShadowRoot: true },
  { selector: "button", useShadowRoot: false },
];

export const ConnectWallet = () => {
  const { isConnected } = useAccount();

  useEffect(() => {
    const button = queryShadowRootDeep(pathToContent) as HTMLElement;
    button.style.borderRadius = "16px";
    button.style.backgroundColor = "#0000005b";
  }, []);
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
