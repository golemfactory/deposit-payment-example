import { useEffect, useRef, useState } from "react";
import { useProcessFile } from "hooks/useUploadFile";
import { Button } from "react-daisyui";
import { RegisterButton } from "./components/RegisterButton";
export const FileUploader = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const { upload } = useProcessFile();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files) {
      [...files].forEach(upload);
    }
  }, [files]);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    // Handle the dropped files
    console.log(files);
    setFiles(files);
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        hidden
        ref={fileInputRef}
      />
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="p-4 border-dashed border-2 border-gray-300 rounded-lg"
        // style={{
        //   border: "2px dashed #aaa",
        //   padding: "20px",
        //   marginBottom: "20px",
        //   borderRadius: "5px",

        // }}
      >
        Drag & Drop files here or{" "}
        <Button
          onClick={() => {
            fileInputRef.current?.click();
          }}
          color="primary"
        >
          Click to Upload
        </Button>
      </div>
    </div>
  );
};
