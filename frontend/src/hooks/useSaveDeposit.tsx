import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

async function saveDeposit({
  nonce,
  funder,
}: {
  funder: `0x${string}`;
  nonce: number;
}): Promise<{ result: boolean }> {
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/create-deposit`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nonce, funder }),
    }
  );
  if (!response.ok)
    throw new Error(`Error registering user: ${response.statusText}`);

  return await response.json();
}

export function useSaveDeposit(): {
  saveDeposit: ({
    nonce,
    funder,
  }: {
    funder: `0x${string}`;
    nonce: number;
  }) => void;
  result: boolean;
} {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: saveDepositMutation } = useMutation<
    { result: boolean },
    unknown,
    {
      funder: `0x${string}`;
      nonce: number;
    },
    unknown
  >({
    mutationFn: saveDeposit,
    onSuccess: (data) => {
      // setTokens(data);
      if (data.result) {
        enqueueSnackbar(<h2>Oh great! Deposit saved &#128525; &#128526;</h2>, {
          variant: "success",
        });
      } else {
        enqueueSnackbar(
          <h2>
            Oh no, there is no free services on golem! You bad &#128545;
            &#128557;
          </h2>,
          {
            variant: "error",
          }
        );
      }
    },
    onError: (error) => {
      // setVerificationError(error);
    },
  });

  return {
    saveDeposit: saveDepositMutation,
    result: true,
  };
}
