import { motion } from "framer-motion";
import { useEffect } from "react";
import { adjustShadowRootStyles, queryShadowRootDeep } from "utils/shadowRoot";
import { flareTestnet } from "viem/chains";
import { useAccount } from "wagmi";

const variants = {
  onTop: {
    top: "40px",
    left: "30px",
  },
  onCenter: {
    top: "50vh",
  },
};

const pathToAccountButton = [
  { selector: "w3m-button", useShadowRoot: true },
  { selector: "w3m-account-button", useShadowRoot: true },
  { selector: "wui-account-button", useShadowRoot: true },
  { selector: "button", useShadowRoot: false },
];

const pathToConnectButton = [
  { selector: "w3m-button", useShadowRoot: true },
  { selector: "w3m-connect-button", useShadowRoot: true },
  { selector: "wui-connect-button", useShadowRoot: true },
  { selector: "button", useShadowRoot: false },
];

export const ConnectWallet = () => {
  const { isConnected } = useAccount();

  useEffect(() => {
    setTimeout(() => {
      try {
        const button = queryShadowRootDeep(pathToAccountButton) as HTMLElement;

        button.style.borderRadius = "16px";
        button.style.backgroundColor = "#0000005b";
        button.style.color = "#ffffffc1";
        button.style.padding = "0.5rem 1rem";
      } catch (e) {
        console.log("Button not found");
      }

      try {
        const button = queryShadowRootDeep(pathToConnectButton) as HTMLElement;

        button.style.borderRadius = "16px";
        button.style.backgroundColor = "#181ea9a6";
      } catch (e) {
        console.log("Button not found");
      }
    }, 0);
  }, [isConnected]);
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
      ></w3m-button>
    </motion.div>
  );
};
