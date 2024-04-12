import { useEffect, useRef, useState } from "react";
import { useProcessFile } from "hooks/useUploadFile";
import { Button } from "react-daisyui";

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
    <div className="w-screen flex justify-center absolute top-[30vh]">
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
        className=" p-20  border-dashed border-2 border-golemblue-transparent rounded-lg"
        style={{
          backgroundColor: "#ffffff14",
        }}
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
          className="ml-4 bg-golemblue-transparent border-none text-white"
          style={{
            backgroundColor: "#181ea9a6",
          }}
        >
          Click to Upload
        </Button>
      </div>
    </div>
  );
};
