import { Card, Stats } from "react-daisyui";

export const Status = () => {
  return (
    <Card>
      <Card.Body>
        <Card.Title>Status</Card.Title>
        <div className="flex flex-col justify-between">
          <div className="stats shadow">
            <div className="stat ">
              <div className="stat-title">Registered</div>
              <div className="stat-value">OK </div>
            </div>
          </div>
          <div className="stats shadow mt-2">
            <div className="stat">
              <div className="stat-title">Approve</div>
              <div className="stat-value">OK</div>
            </div>
            <div className="stat">
              <div className="stat-title">Given</div>
              <div className="stat-value">4200</div>
            </div>
            <div className="stat "></div>
            <div className="stat "></div>
            <div className="stat ">
              <div className="stat-actions m-0">
                <button className="btn">Change</button>
              </div>
            </div>
          </div>
          <div className="stats shadow mt-2">
            <div className="stat">
              <div className="stat-title">Deposit</div>
              <div className="stat-value">OK</div>
            </div>

            <div className="stat">
              <div className="stat-title">Amount locked</div>
              <div className="stat-value">1200</div>
            </div>
            <div className="stat">
              <div className="stat-title">Fee locked</div>
              <div className="stat-value">1200</div>
            </div>
            <div className="stat">
              <div className="stat-title">Amount spent</div>
              <div className="stat-value">1200</div>
            </div>
            <div className="stat">
              <div className="stat-title">Fee spent</div>
              <div className="stat-value">1200</div>
            </div>
          </div>
          <div className="stats shadow mt-2 ">
            <div
              className="stat "
              style={{
                opacity: 0.3,
              }}
            >
              <div className="stat-title">Allocation </div>
              <div className="stat-value"> - </div>
            </div>
            <div
              className="stat "
              style={{
                opacity: 0.3,
              }}
            >
              <div className="stat-title">Given</div>
              <div className="stat-value">-</div>
            </div>
            <div className="stat "></div>
            <div className="stat "></div>
            <div
              className="stat "
              style={{
                opacity: 1,
              }}
            >
              <div className="stat-actions m-0">
                <button className="btn">Create </button>
              </div>
            </div>
          </div>
          <div className="stats shadow mt-2">
            <div className="stat " style={{ opacity: 0.3 }}>
              <div className="stat-title">Agreement</div>
              <div className="stat-value">-</div>
            </div>
            <div className="stat ">
              {/* <div className="stat-title">Given</div>
              <div className="stat-value">4200</div> */}
            </div>
            <div className="stat "></div>
            <div className="stat "></div>
            <div
              className="stat "
              style={{
                opacity: 0.3,
              }}
            >
              <div className="stat-actions m-0">
                <button className="btn">Create </button>
              </div>
            </div>{" "}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};
