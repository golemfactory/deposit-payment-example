import { Button } from "react-daisyui";
import { useSignNonce } from "hooks/useSignNonce";
import { useLogin } from "hooks/useLogin";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { motion } from "framer-motion";

export const RegisterButton = () => {
  const { register, signature, message } = useSignNonce();
  const { address: walletAddress } = useAccount();
  const { login, tokens } = useLogin();

  if (!walletAddress) {
    throw new Error("Wallet address not found");
  }

  useEffect(() => {
    if (signature) {
      login({
        walletAddress,
        messageSignature: signature,
        message,
      });
    }
  }, [signature]);

  useEffect(() => {
    if (tokens) {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
    }
  }, [tokens]);

  const MotionButton = motion(Button);

  return (
    <MotionButton
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      onClick={() => {
        register({ walletAddress });
      }}
      className="bg-primary !text-white border-none text-lg font-light absolute"
      style={{
        top: "50vh",
      }}
    >
      Register in service
    </MotionButton>
  );
};
