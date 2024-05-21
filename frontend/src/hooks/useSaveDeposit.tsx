import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useState } from "react";

async function saveDeposit({
  nonce,
  funder,
  id,
}: {
  funder: `0x${string}`;
  nonce: number;
  id: string;
}): Promise<{ result: boolean }> {
  console.log("nonce", nonce);
  console.log("funder", funder);
  console.log("id", id);
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/create-deposit`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nonce, funder, id }),
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
    id,
  }: {
    funder: `0x${string}`;
    nonce: number;
    id: string;
  }) => void;
  result: boolean;
  isSuccess: boolean;
  isError: boolean;
} {
  const { enqueueSnackbar } = useSnackbar();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const { mutate: saveDepositMutation } = useMutation<
    { result: boolean },
    unknown,
    {
      funder: `0x${string}`;
      nonce: number;
      id: string;
    },
    unknown
  >({
    mutationFn: saveDeposit,
    onSuccess: (data) => {
      setIsSuccess(true);
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
      console.error("Error saving deposit", error);
      setIsError(true);
      // setVerificationError(error);
    },
  });

  return {
    saveDeposit: saveDepositMutation,
    result: true,
    isSuccess,
    isError,
  };
}
