import { useState } from "react";
import { Link } from "react-daisyui";
import { useSnackbar } from "notistack";
export const AllocationLink = ({
  allocationId = "",
}: {
  allocationId?: string;
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(allocationId);
    setIsCopied(true);
    enqueueSnackbar("Allocation Id to clipboard", { variant: "success" });
  };

  const shortenedId = `${allocationId.slice(0, 3)}...${allocationId.slice(-3)}`;

  return (
    <div>
      <Link
        // href={`https://stats.golem.network/allocation/${allocationId}`}
        rel="noreferrer"
        onClick={() => {
          handleClick();
        }}
      >
        {shortenedId}
      </Link>
      {/* <button onClick={handleClick}>
          {isCopied ? "Copied!" : "Copy to Clipboard"}
        </button> */}
    </div>
  );
};
