import { useScanResults } from "hooks/useScanResults";
import { Card, Progress, RadialProgress } from "react-daisyui";

import { motion } from "framer-motion";
import { useFileUploader } from "./providers/fileUploader";
import { P, match } from "ts-pattern";
import { useEffect } from "react";

export const ScanResults = () => {
  //TODO merge two hooks into one
  const { data } = useScanResults();
  const { files } = useFileUploader();

  return (
    <>
      <ul>
        {data
          .concat(
            Array.from(files.entries()).map(([key, progress]) => {
              return {
                id: key,
                result: "pending",
                data: {
                  progress: progress,
                },
              };
            })
          )
          .map(
            (
              scanResult:
                | {
                    result: "infected" | "clean";
                    id: string;
                    data: {
                      Viruses: string[];
                    };
                  }
                | {
                    result: "pending";
                    id: string;
                    data: {
                      progress: number;
                    };
                  }
            ) => (
              <li key={scanResult.id}>
                {match(scanResult.result)
                  .with("infected", () => (
                    //@ts-ignore
                    <InfectedCard id={scanResult.id} data={scanResult.data} />
                  ))
                  .with("clean", () => (
                    <CleanCard id={scanResult.id} data={scanResult.data} />
                  ))
                  .with("pending", () => (
                    //@ts-ignore
                    <PendingCard id={scanResult.id} data={scanResult.data} />
                  ))
                  .exhaustive()}
              </li>
            )
          )}
      </ul>
    </>
  );
};

const PendingCard = (result: { id: string; data: { progress: number } }) => {
  return (
    <Card
      className="p-4 bg-[#0000005b] m-2 !text-white rounded-md border-none"
      style={{
        color: "white",
      }}
    >
      <div>
        <Card.Title></Card.Title>
        <Card.Body>
          <div className="grid gap-4 items-center">
            <h1 className="italic text-2xl">{result.id}</h1> Uploading
            <RadialProgress value={result.data.progress}>
              {result.data.progress}%
            </RadialProgress>
          </div>
        </Card.Body>
        <Card.Actions className="justify-end"></Card.Actions>
      </div>
    </Card>
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
        className="p-4 bg-transparent-red m-2 !text-white rounded-md border-none"
        style={{
          color: "white",
        }}
      >
        <Card.Body>
          <div className="flex gap-4 items-center">
            <h1 className="italic text-2xl">{result.id}</h1> Infected
          </div>
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
        </Card.Body>
        <Card.Actions className="justify-end"></Card.Actions>
      </Card>
    </motion.div>
  );
};

const CleanCard = (result: { id: string; data: object }) => {
  return (
    <Card
      className="p-4 bg-transparent-green m-2 !text-white rounded-md border-none"
      style={{
        color: "white",
      }}
    >
      <div>
        <Card.Body>
          <div className="flex gap-4 items-center">
            <h1 className="italic text-2xl">{result.id}</h1> Clean
          </div>
        </Card.Body>
        <Card.Actions className="justify-end"></Card.Actions>
      </div>
    </Card>
  );
};
