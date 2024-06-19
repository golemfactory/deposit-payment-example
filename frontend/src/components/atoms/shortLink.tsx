import { useState } from "react";
import { Link } from "react-daisyui";
import { useSnackbar } from "notistack";

export const ShortLink = ({ id = "" }: { id?: string }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [isCopied, setIsCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText(id);
    setIsCopied(true);
    enqueueSnackbar("Copied to clipboard", { variant: "success" });
  };

  const shortenedId =
    id.length > 9 ? `${id.slice(0, 3)}...${id.slice(-3)}` : `${id}`;

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
