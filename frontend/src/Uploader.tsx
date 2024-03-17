import { useEffect, useRef, useState } from "react";
import { useProcessFile } from "hooks/useUploadFile";
import { Button } from "react-daisyui";
import { RegisterButton } from "./RegisterButton";
export const FileUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const { upload } = useProcessFile();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (file) {
      upload({ file });
    }
  }, [file]);

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        hidden
        ref={fileInputRef}
      />
      <Button
        onClick={() => {
          fileInputRef.current?.click();
        }}
      >
        Upload
      </Button>
    </div>
  );
};
