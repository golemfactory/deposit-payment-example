import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import useSWRMutation from "swr/mutation";
import { useSignMessage } from "wagmi";
import axios from "axios";
import { useMap } from "@uidotdev/usehooks";

export const useUploadedFiles = () => {
  const files = useMap<string>();

  const setProgress = useCallback((id: string, progress: number) => {
    files.set(id, progress);
  }, []);

  const removeFile = useCallback((id: string) => {
    files.delete(id);
  }, []);

  const getProgress = useCallback((id: string) => files.get(id), []);

  return {
    files,
    setProgress,
    getProgress,
    removeFile,
  };
};

async function processFile(
  [key, onProgress]: [string, (name: string, progress: number) => void],
  { arg: file }: { arg: File }
) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await axios.post(
    `${import.meta.env.VITE_BACKEND_URL}/process-file`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },

      onUploadProgress: (progressEvent) => {
        if (!progressEvent.total) return;

        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        // setProgress(progress);
      },
    }
  );
  if (response.status !== 200)
    throw new Error(`Error uploading file user: ${response.statusText}`);

  return response.data;
}

export function useProcessFile(): {
  upload: (file: File) => void;
} {
  const { setProgress } = useUploadedFiles();

  const onProgress = (name: string, progress: number) => {
    setProgress(name, progress);
  };
  const { trigger } = useSWRMutation(["scanResult", onProgress], processFile);

  return {
    upload: trigger,
  };
}

export function useUploadFile() {
  const { upload } = useProcessFile();
}
