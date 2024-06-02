import { useUser } from "hooks/useUser";

export const Register = () => {
  const { user } = useUser();
  return (
    <div className="stats shadow">
      <div className="stat ">
        <div className="stat-title">Registered</div>
        <div className="stat-value">
          {user.isRegistered() ? "OK" : "Not registered"}{" "}
        </div>
      </div>
    </div>
  );
};
