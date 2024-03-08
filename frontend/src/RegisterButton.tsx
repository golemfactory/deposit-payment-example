import { Button } from "react-daisyui";
import { useSignNonce } from "hooks/useSignNonce";
import { useLogin } from "hooks/useLogin";
import { useAccount } from "wagmi";
import { useEffect } from "react";

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
  return (
    <Button
      onClick={() => {
        register({ walletAddress });
      }}
    >
      Register
    </Button>
  );
};
