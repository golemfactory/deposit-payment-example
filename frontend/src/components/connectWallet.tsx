import { motion } from "framer-motion";
import { useEffect } from "react";
import { adjustShadowRootStyles, queryShadowRootDeep } from "utils/shadowRoot";
import { flareTestnet } from "viem/chains";
import { useAccount } from "wagmi";
import { useBalance } from "hooks/useBalance";
import { formatBalance } from "utils/formatBalance";
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

const pathToAccountText = [
  { selector: "w3m-button", useShadowRoot: true },
  { selector: "w3m-account-button", useShadowRoot: true },
  { selector: "wui-account-button", useShadowRoot: true },
  { selector: "button", useShadowRoot: false },
  { selector: "wui-text", useShadowRoot: true },
  { selector: "slot", useShadowRoot: false },
];

const pathToConnectButton = [
  { selector: "w3m-button", useShadowRoot: true },
  { selector: "w3m-connect-button", useShadowRoot: true },
  { selector: "wui-connect-button", useShadowRoot: true },
  { selector: "button", useShadowRoot: false },
];

const pathToConnectText = [
  { selector: "w3m-button", useShadowRoot: true },
  { selector: "w3m-connect-button", useShadowRoot: true },
  { selector: "wui-connect-button", useShadowRoot: true },
  { selector: "button", useShadowRoot: false },
  { selector: "wui-text", useShadowRoot: true },
  { selector: "slot", useShadowRoot: false },
];

export const ConnectWallet = () => {
  const { isConnected, address } = useAccount();
  const { GLM, ETH } = useBalance();

  useEffect(() => {
    setTimeout(() => {
      try {
        const slot = queryShadowRootDeep(pathToAccountText) as HTMLSlotElement;
        slot.style.fontSize = "16px";
        slot.style.fontWeight = "400";
        slot.style.color = "white";
        const textNode = slot.assignedNodes()[1] as Text;
        const balanceSummary = `GLM: ${formatBalance(GLM)} / ETH: ${formatBalance(ETH)}`;
        if (ETH && GLM) {
          setTimeout(() => {
            textNode.textContent = balanceSummary;
          }, 1000);
        }
      } catch (e) {}
    }, 1000);
  }, [isConnected, GLM, ETH, address]);
  useEffect(() => {
    setTimeout(() => {
      try {
        const button = queryShadowRootDeep(pathToAccountButton) as HTMLElement;
        button.style.color = "white";
        button.style.borderRadius = "3px";
        button.style.backgroundColor = "#181ea9";
        button.style.padding = "0.5rem 1rem";
        button.style.fontSize = "16px";
        button.style.fontWeight = "400";
      } catch (e) {}

      try {
        const button = queryShadowRootDeep(pathToConnectButton) as HTMLElement;
        button.style.color = "white";

        button.style.fontSize = "16px";
        button.style.fontWeight = "100";
        button.style.borderRadius = "3px";
        button.style.backgroundColor = "#181ea9";
      } catch (e) {}

      try {
        const text = queryShadowRootDeep(pathToConnectText) as HTMLElement;
        text.style.fontWeight = "400";
        text.style.color = "white";
      } catch (e) {}
    }, 0);
  }, [isConnected]);
  return (
    <motion.div
      variants={variants}
      transition={{ duration: 0.5 }}
      className="pt-8"
    >
      <w3m-button
      //@ts-ignore
      ></w3m-button>
    </motion.div>
  );
};
