import { AnimatePresence, motion } from "framer-motion";
import { useCreateAllocation } from "hooks/useCreateAllocation";
import { Button, Card, Loading } from "react-daisyui";

export const GolemManagerForm = ({ isVisible }: { isVisible: boolean }) => {
  const { createAllocation, isCreating } = useCreateAllocation();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card
            style={{
              borderColor: "#ffffff14",
              fontFamily: "Kanit-Light",
              backgroundColor: "#0000005b",
              width: "40vw",
            }}
          >
            <Card.Body>
              <Card.Title tag="h2">Start Golem services</Card.Title>
              <Card.Body>
                Create an allocation now to start using Golem services.
              </Card.Body>

              <Card.Actions className="justify-end">
                <Button
                  onClick={() => {
                    createAllocation();
                  }}
                  className="bg-primary !text-white border-none text-lg font-light "
                  style={{
                    backgroundColor: "#181ea9a6",
                  }}
                >
                  {isCreating ? (
                    <Loading variant="infinity" />
                  ) : (
                    "Create allocation"
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
