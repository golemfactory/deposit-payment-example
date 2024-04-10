import { Button, Card, Loading } from "react-daisyui";
import { useSignNonce } from "hooks/useSignNonce";
import { useLogin } from "hooks/useLogin";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDebounce } from "hooks/useDebounce";
export const RegisterButton = ({ isVisible }: { isVisible: boolean }) => {
  const { register, signature, message, isPending } = useSignNonce();
  const { address: walletAddress } = useAccount();
  const { login, tokens, isWaiting } = useLogin();

  if (!walletAddress) {
    throw new Error("Wallet address not found");
  }

  const debouncedPending = useDebounce(
    isPending,
    new Map([
      [true, 0],
      [false, 1000],
    ])
  );

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
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <Card
            style={{
              borderColor: "#ffffff14",
              fontFamily: "Kanit-Light",
              backgroundColor: "#0000005b",
              scale: "1.2",
            }}
          >
            <Card.Body>
              {/* <Card.Title tag="h2">Log in</Card.Title> */}
              <Card.Body>
                Login to service with your wallet address to prove your wallet
                ownership.
              </Card.Body>

              <Card.Actions className="justify-end">
                <Button
                  onClick={() => {
                    register({ walletAddress });
                  }}
                  className="bg-primary !text-white border-none text-lg font-light "
                  style={{
                    backgroundColor: "#181ea9a6",
                  }}
                >
                  {isWaiting || debouncedPending ? (
                    <Loading variant="infinity" />
                  ) : (
                    "Register in service"
                  )}
                </Button>{" "}
              </Card.Actions>
            </Card.Body>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
    //   <Button
    //     onClick={() => {
    //       register({ walletAddress });
    //     }}
    //     className="bg-primary !text-white border-none text-lg font-light "
    //     style={{
    //       backgroundColor: "#181ea9a6",
    //     }}
    //   >
    //     Register in service
    //   </Button>
    // );
  );
};
