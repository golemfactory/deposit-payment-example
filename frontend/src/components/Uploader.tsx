import { useEffect, useRef, useState } from "react";
import { useFileUploader, useUploadFile } from "./providers/fileUploader";
import { Button, Card, Loading } from "react-daisyui";
import { use } from "i18next";

export const FileUploader = () => {
  const { files, upload } = useFileUploader();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    console;
    if (files.size > 0) {
      setIsUploading(true);
    }
  }, [files.size]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      upload(e.target.files);
    }
  };
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    upload(files);
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
        {isUploading ? (
          <div className="h-full flex flex-col items-center justify-center">
            <div className="text-center stat-value">Processing </div>
            <Loading variant="infinity" className="text-primary h-12 w-12" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </Card.Body>
    </Card>
  );
};
