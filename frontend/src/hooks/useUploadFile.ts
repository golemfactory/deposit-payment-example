import { useMutation } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSignMessage } from "wagmi";

async function processFile({
  file,
}: {
  file: File;
}): Promise<{ result: boolean }> {
  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/process-file`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (!response.ok)
    throw new Error(`Error uploading file user: ${response.statusText}`);

  return await response.json();
}

export function useProcessFile(): {
  upload: ({ file }: { file: File }) => void;
} {
  const { enqueueSnackbar } = useSnackbar();

  const { mutate: uploadFileMutation } = useMutation<
    { result: boolean },
    unknown,
    { file: File },
    unknown
  >({
    mutationFn: processFile,
    onSuccess: (data) => {
      enqueueSnackbar("Uploaded successfully", { variant: "success" });
    },
    onError: (error) => {
      enqueueSnackbar(`Error registering: ${error}`, { variant: "error" });
    },
  });

  return {
    upload: uploadFileMutation,
  };
}
