import { useCurrentAgreement } from "hooks/yagna/useCurrentAgreement";
import { Card } from "react-daisyui";

export const Action = () => {
  const currentAgreement = useCurrentAgreement();
  return <>DUPA</>;
  // return (
  //   <>
  //     {currentAgreement?.state === "Approved" ? (
  //       <Card>
  //         <Card.Body>
  //           <Card.Title className="justify center"></Card.Title>
  //           <div className="flex flex-col justify-between">
  //             <div className="stat">
  //               <div className="stat-title">Agreement</div>
  //               <div className="stat-value">Signed</div>
  //             </div>
  //           </div>
  //         </Card.Body>
  //       </Card>
  //     ) : (
  //       ""
  //     )}
  //   </>
  // );
};
