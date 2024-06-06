import { Link } from "react-daisyui";
import { shortTransaction } from "utils/shortTransaction";

export const EtherScanLink = ({
  hash,
  route,
}: {
  route?: string;
  hash: `0x${string}`;
}) => {
  if (!route) route = "tx";
  return (
    <Link
      href={`https://holesky.etherscan.io/${route}/${hash}`}
      target="_blank"
      rel="noreferrer"
      className="text-primary"
    >
      {shortTransaction(hash)}
    </Link>
  );
};
