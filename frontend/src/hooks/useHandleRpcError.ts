//only thing that we get from rpc node in case of error seems to be string message
//We have to parse them in order to handle properly

import { useSnackbar } from "notistack";
import { useCallback, useState } from "react";

export enum RPC_ERROR_CONTEXT {
  amount = "amount",
  valid_to = "valid_to",
  fee = "fee",
}
const RPC_ERRORS = [
  {
    type: "DEPOSIT_EXCEED_ALLOWANCE",
    message: "Deposit amount + fee, exceeds allowance.",
    phrase: "exceeds allowance",
    context: [RPC_ERROR_CONTEXT.amount, RPC_ERROR_CONTEXT.fee],
  },
  {
    phrase: "deposit.validTo <= validTo",
    type: "DEPOSIT_VALID_TO",
    message: "Valid to date must be greater than current valid to date.",
    context: [RPC_ERROR_CONTEXT.valid_to],
  },
];

export const useHandleRpcError = () => {
  const [errorContext, setErrorContext] = useState<RPC_ERROR_CONTEXT[]>([]);
  const { enqueueSnackbar } = useSnackbar();
  const getRpcError = useCallback((message: string) => {
    const error = RPC_ERRORS.find((rpcError) =>
      message.includes(rpcError.phrase)
    );
    return error;
  }, []);

  const handleRpcError = useCallback((e: Error) => {
    const message = e.message;
    const error = getRpcError(message);
    //if we have error message from rpc node, we can handle it nicely
    if (error) {
      setErrorContext(error.context);
      enqueueSnackbar(error.message, { variant: "error" });
    } else {
      enqueueSnackbar(message, { variant: "error" });
    }
  }, []);

  return { showNotification: handleRpcError, errorContext };
};
