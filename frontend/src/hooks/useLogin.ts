import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { is, set } from "ramda";
import { useEffect, useState } from "react";
async function login({
  messageSignature,
  walletAddress,
  message,
}: {
  messageSignature: `0x${string}`;
  walletAddress: `0x${string}`;
  message: string;
}): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress, messageSignature, message }),
  });
  if (!response.ok)
    throw new Error(`Error registering user: ${response.statusText}`);

  return await response.json();
}

type IUseLogin = {
  login: UseMutateFunction<
    { accessToken: string; refreshToken: string },
    unknown,
    {
      walletAddress: `0x${string}`;
      messageSignature: `0x${string}`;
      message: string;
    },
    unknown
  >;
  tokens: { accessToken: string; refreshToken: string } | undefined;
  isWaiting: boolean;
  isError: boolean;
};

export function useLogin(): IUseLogin {
  const [isWaiting, setIsWaiting] = useState(false);
  const [isError, setIsError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [tokens, setTokens] = useState<
    { accessToken: string; refreshToken: string } | undefined
  >(undefined);

  const [verificationError, setVerificationError] =
    useState<unknown>(undefined);

  useEffect(() => {
    if (verificationError) {
      enqueueSnackbar(`Error signing message: ${verificationError}`, {
        variant: "error",
      });
    }
  }, [verificationError]);

  // useEffect(() => {
  //   setIsWaiting(!tokens);
  // }, [tokens]);
  const { mutate: loginMutation } = useMutation<
    { accessToken: string; refreshToken: string },
    unknown,
    {
      walletAddress: `0x${string}`;
      messageSignature: `0x${string}`;
      message: string;
    },
    unknown
  >({
    mutationFn: login,
    onSettled: () => {
      console.log("settled");
      setIsWaiting(true);
    },
    onSuccess: (data) => {
      setTokens(data);
      setIsWaiting(false);
    },
    onError: (error) => {
      setVerificationError(error);
      setIsWaiting(false);
      setIsError(true);
    },
  });

  return {
    login: loginMutation,
    tokens,
    isWaiting,
    isError,
  };
}
