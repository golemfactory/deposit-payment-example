import {
  createContext,
  useContext,
  PropsWithChildren,
  useCallback,
} from "react";

import useSWRMutation from "swr/mutation";

import axios from "axios";
import { useMap } from "@uidotdev/usehooks";

export const useUploadedFiles = () => {
  const files = useMap<string>();

  const setProgress = (id: string, progress: number) => {
    console.log("setting progress", id, progress);
    files.set(id, progress);
  };

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

const FileUploaderContext = createContext({
  files: new Map<string, number>(),
  setProgress: (id: string, progress: number) => {},
  removeFile: (id: string) => {},
});

export const useFileUploader = () => {
  return useContext(FileUploaderContext);
};

export const FileUploaderProvider = ({ children }: PropsWithChildren) => {
  const { files, setProgress, removeFile } = useUploadedFiles();

  return (
    <FileUploaderContext.Provider value={{ files, setProgress, removeFile }}>
      {children}
    </FileUploaderContext.Provider>
  );
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
        console.log("onprogress axios", progressEvent);
        if (!progressEvent.total) return;

        const progress = Math.round(
          (progressEvent.loaded / progressEvent.total) * 100
        );
        onProgress(file.name, progress);
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
  const { setProgress } = useFileUploader();

  const onProgress = (name: string, progress: number) => {
    console.log("progress", name, progress);
    setProgress(name, progress);
  };
  const { trigger } = useSWRMutation(["scanResult", onProgress], processFile);

  return {
    upload: trigger,
  };
}

export function useUploadFile() {
  const { upload } = useProcessFile();
  return {
    upload,
  };
}
