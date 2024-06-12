import { FileUploader } from "components/Uploader";
import { useCurrentAgreement } from "hooks/yagna/useCurrentAgreement";
import { Card } from "react-daisyui";

export const Action = () => {
  const currentAgreement = useCurrentAgreement();

  return <>{currentAgreement?.state !== "Approvess" ? <FileUploader /> : ""}</>;
};
