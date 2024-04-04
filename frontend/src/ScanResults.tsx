import { useScanResults } from "hooks/useScanResults";
import { Card } from "react-daisyui";

import { motion } from "framer-motion";

export const ScanResults = () => {
  const { data } = useScanResults();
  return (
    <>
      <ul>
        {data?.map(
          (scanResult: {
            result: "infected" | "clean";
            id: string;
            data: {
              Viruses: string[];
            };
          }) => (
            <li key={scanResult.id}>
              {scanResult.result === "infected" ? (
                <InfectedCard id={scanResult.id} data={scanResult.data} />
              ) : (
                <CleanCard id={scanResult.id} data={scanResult.data} />
              )}
            </li>
          )
        )}
      </ul>
    </>
  );
};

const InfectedCard = (result: {
  id: string;
  data: {
    Viruses: string[];
  };
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Card
        className="bg-notistack-red m-2 !text-white rounded-md border-none"
        style={{
          color: "white",
        }}
      >
        <div>
          <Card.Title>
            {" "}
            <h1 className="italic">{result.id}</h1> is infected
          </Card.Title>

          <div className="flex flex-col">
            <h2 className="text-left">Detected viruses:</h2>
            <ul>
              {Object.entries(result.data.Viruses).map(([key, value]) => (
                <li className="text-left" key={key}>
                  {key}: {value}
                </li>
              ))}
            </ul>
          </div>
          <Card.Actions className="justify-end"></Card.Actions>
        </div>
      </Card>
    </motion.div>
  );
};

const CleanCard = (result: { id: string; data: object }) => {
  return (
    <Card
      className="bg-notistack-green m-2 !text-white rounded-md border-none"
      style={{
        color: "white",
      }}
    >
      <div>
        <Card.Title>
          {" "}
          <h1 className="italic">{result.id}</h1> is clean
        </Card.Title>
        <Card.Actions className="justify-end"></Card.Actions>
      </div>
    </Card>
  );
};