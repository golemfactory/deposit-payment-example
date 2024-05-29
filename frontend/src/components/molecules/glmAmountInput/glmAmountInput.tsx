import { GolemCoinIcon } from "../../atoms/golem.coin.icon";

export const GLMAmountInput = ({
  amount,
  setAmount,
  placeholder,
}: {
  placeholder?: string;
  amount: number;
  setAmount: (value: number) => void;
}) => {
  return (
    <label className="input input-bordered flex items-center gap-4">
      <input
        className="w-[75%]"
        type="number"
        min={0}
        autoFocus={true}
        placeholder={placeholder}
        onChange={(e) => {
          setAmount(Number(e.target.value));
        }}
      />{" "}
      <GolemCoinIcon />
    </label>
  );
};
