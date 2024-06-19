import { Link } from "react-daisyui";
import { shortTransaction } from "utils/shortTransaction";

export const EtherScanLink = ({
  hash,
  route = "tx",
}: {
  route?: string;
  hash: `0x${string}`;
}) => {
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
