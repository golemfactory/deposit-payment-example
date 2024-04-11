import { config } from "config";
import { AnimatePresence, motion } from "framer-motion";
import { useApprove } from "hooks/GLM/useGLMApprove";
import { useUser } from "hooks/useUser";
import { Button, Card, Loading } from "react-daisyui";
import { formatEther } from "viem";

const MotionButton = motion(Button);

export const ApproveForm = ({ isVisible }: { isVisible: boolean }) => {
  const { user } = useUser();
  const { approve, isProcessing } = useApprove();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card
            style={{
              borderColor: "#ffffff14",
              fontFamily: "Kanit-Light",
              backgroundColor: "#0000005b",
              scale: "1.2",
            }}
          >
            <Card.Body>
              <Card.Title tag="h2">Approve needed</Card.Title>
              <Card.Body>
                In order to properly use the service you need to allow service
                to spend your GLM tokens. <hr />
                Your current GLM allowance is{" "}
                {formatEther(user.allowanceAmount || 0n)} GLM.
                <hr />
                Minimal allowance amount is{" "}
                {formatEther(config.minimalAllowance)} GLM
              </Card.Body>

              <Card.Actions className="justify-end">
                <Button
                  onClick={() => {
                    approve();
                  }}
                  className="bg-primary !text-white border-none text-lg font-light "
                  style={{
                    backgroundColor: "#181ea9a6",
                  }}
                >
                  {isProcessing ? <Loading variant="infinity" /> : "Approve"}
                </Button>{" "}
              </Card.Actions>
            </Card.Body>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
