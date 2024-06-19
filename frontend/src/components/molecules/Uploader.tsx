import { useEffect, useRef, useState } from "react";
import { useFileUploader } from "../providers/fileUploader";
import { Button, Card, Loading } from "react-daisyui";
import { Bip } from "components/atoms/bip";

export const FileUploader = () => {
  const { files, upload } = useFileUploader();
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (files.size > 0) {
      setIsUploading(true);
    } else {
      setIsUploading(false);
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
      className="border-dashed h-48 pt-2 pb-4 mt-8"
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
            <Card.Title className="w-full text-center flex-col">
              {" "}
              Drag & Drop files here or{" "}
            </Card.Title>
            <div className="grid grid-cols-8">
              <Button
                className="relative col-start-4 col-span-2 pb-12 pt-4 text-xl mt-6 mb-12"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
              >
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-8"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.625 1.5H9a3.75 3.75 0 0 1 3.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H16.5a3.75 3.75 0 0 1 3.75 3.75v7.875c0 1.035-.84 1.875-1.875 1.875H5.625a1.875 1.875 0 0 1-1.875-1.875V3.375c0-1.036.84-1.875 1.875-1.875ZM12.75 12a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V18a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V12Z"
                      clipRule="evenodd"
                    />
                    <path d="M14.25 5.25a5.23 5.23 0 0 0-1.279-3.434 9.768 9.768 0 0 1 6.963 6.963A5.23 5.23 0 0 0 16.5 7.5h-1.875a.375.375 0 0 1-.375-.375V5.25Z" />
                  </svg>

                  <div className="text-xl">Upload</div>
                  <Bip />
                </>
              </Button>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};
