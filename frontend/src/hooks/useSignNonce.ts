import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSignMessage } from "wagmi";

async function signNonce({
  walletAddress,
}: {
  walletAddress: `0x${string}`;
}): Promise<{ nonce: number }> {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ walletAddress }),
  });
  if (!response.ok)
    throw new Error(`Error registering user: ${response.statusText}`);

  return await response.json();
}

export function useSignNonce(): {
  register: ({ walletAddress }: { walletAddress: `0x${string}` }) => void;
  signature: `0x${string}` | undefined;
  message: string;
} {
  const { enqueueSnackbar } = useSnackbar();
  const { data, error: signError, signMessage } = useSignMessage();
  const [message, setMessage] = useState<string>("");
  useEffect(() => {
    if (signError) {
      enqueueSnackbar(`Error signing message: ${signError}`, {
        variant: "error",
      });
    }
  }, [signError]);

  const { mutate: signNonceMutation } = useMutation<
    { nonce: number },
    unknown,
    { walletAddress: `0x${string}` },
    unknown
  >({
    mutationFn: signNonce,
    onSuccess: (data) => {
      const message = `Login to service by signing nonce: ${data.nonce}`;
      setMessage(message);
      signMessage({
        message,
      });
      // enqueueSnackbar("Registered successfully", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(`Error registering: ${error}`, { variant: "error" });
    },
  });

  return {
    register: signNonceMutation,
    signature: data,
    message: message,
  };
}
