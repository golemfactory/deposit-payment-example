import { UseMutateFunction, useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
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
};

export function useLogin(): IUseLogin {
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

  useEffect(() => {
    if (tokens) {
      enqueueSnackbar(`Registered successfully`, {
        variant: "success",
      });
    }
  }, [tokens]);
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
    onSuccess: (data) => {
      setTokens(data);
    },
    onError: (error) => {
      setVerificationError(error);
    },
  });

  return {
    login: loginMutation,
    tokens,
  };
}
