import { Card } from "react-daisyui";
import { Register } from "./statusSections/register";
import { Approve } from "./statusSections/approve";
import { Deposit } from "./statusSections/deposit";
import { Allocation } from "./statusSections/allocation";
import { Agreement } from "./statusSections/agreement";

export const Status = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Status</Card.Title>
        <div className="flex flex-col justify-between">
          <Register />
          <Approve />
          <Deposit />
          <Allocation />
          <Agreement />
        </div>
      </Card.Body>
    </Card>
  );
};
