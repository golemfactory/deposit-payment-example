import { Link } from "react-daisyui";
import { shortTransaction } from "utils/shortTransaction";

export const EtherScanLink = ({ hash }: { hash: `0x${string}` }) => {
  return (
    <Link
      href={`https://holesky.etherscan.io/tx/${hash}`}
      target="_blank"
      rel="noreferrer"
      className="text-primary"
    >
      {shortTransaction(hash)}
    </Link>
  );
};
