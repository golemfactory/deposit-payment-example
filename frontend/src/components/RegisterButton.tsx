import { Button, Card, Loading } from "react-daisyui";
import { useSignNonce } from "hooks/useSignNonce";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useDebounce } from "hooks/useDebounce";
import { useUser } from "hooks/useUser";
export const RegisterButton = ({ isVisible }: { isVisible: boolean }) => {
  const { register, signature, message, isPending } = useSignNonce();
  const { address: walletAddress } = useAccount();
  const { user } = useUser();
  // Add the missing 'login' property to the type definition
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
      user.login({
        walletAddress,
        messageSignature: signature,
        message,
      });
    }
  }, [signature]);

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
                  {user.isLoggingIn() || debouncedPending ? (
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
  );
};
