import { FileUploader } from "components/Uploader";
import { useUser } from "hooks/useUser";
import { useCurrentAgreement } from "hooks/yagna/useCurrentAgreement";
import { Card } from "react-daisyui";

export const Action = () => {
  const currentAgreement = useCurrentAgreement();

  const { user } = useUser();

  return (
    <>
      {user.currentAgreement?.state === "Approved" ? (
        <FileUploader />
      ) : (
        <Card>
          <Card.Body>
            <Card.Title>Title</Card.Title>
            <div>
              <p>Lorem ipsum Lorem ipsum </p>
            </div>
          </Card.Body>
        </Card>
      )}
    </>
  );
};
