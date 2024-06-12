import { useEffect, useRef, useState } from "react";
import { useUploadFile } from "./providers/fileUploader";
import { Button, Card } from "react-daisyui";

export const FileUploader = () => {
  const [files, setFiles] = useState<FileList | null>(null);
  const { upload } = useUploadFile();
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (files) {
      console.log("upkoad", files);
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
    setFiles(files);
  };

  return (
    <Card
      className="border-dashed h-48"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        hidden
        ref={fileInputRef}
      />
      <Card.Body>
        <Card.Title> Drag & Drop files here or </Card.Title>
        <div className="grid grid-cols-6">
          <Button
            className="col-start-3 col-span-2"
            onClick={() => {
              fileInputRef.current?.click();
            }}
          >
            Click to Upload
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
