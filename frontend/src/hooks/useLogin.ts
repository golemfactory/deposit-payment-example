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
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_HTTP_URL}/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletAddress, messageSignature, message }),
    }
  );
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
  isLoggingIn: boolean;
  isSuccess: boolean;
};

export function useLogin(): IUseLogin {
  const { enqueueSnackbar } = useSnackbar();
  const [tokens, setTokens] = useState<
    { accessToken: string; refreshToken: string } | undefined
  >({
    accessToken: localStorage.getItem("accessToken") || "",
    refreshToken: localStorage.getItem("refreshToken") || "",
  });

  const {
    mutate: loginMutation,
    isSuccess,
    isPending,
    isError,
    error,
    data,
  } = useMutation<
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
  });

  useEffect(() => {
    if (isError) {
      enqueueSnackbar(`Error signing message: ${error}`, {
        variant: "error",
      });
    }
  }, [isError]);

  useEffect(() => {
    if (isSuccess && data) {
      setTokens(data);
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
    }
  }, [isSuccess, data]);
  return {
    login: loginMutation,
    tokens,
    isLoggingIn: isPending,
    isSuccess,
  };
}
