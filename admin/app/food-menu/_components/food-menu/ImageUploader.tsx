/* eslint-disable jsx-a11y/alt-text */
import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";
import { UploadedImage } from "./UploadedImage";

type ImageUploaderProps = {
  imgFile?: File;
  previewUrl?: string | null;
  onFileSelect: (file: File) => void;
  onRemoveImage?: () => void;
};

export const ImageUploader = ({
  imgFile,
  previewUrl,
  onFileSelect,
  onRemoveImage,
}: ImageUploaderProps) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!imgFile) return;

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setImageSrc(fileReader.result as string);
    };
    fileReader.readAsDataURL(imgFile);
  }, [imgFile]);

  const currentImageSrc = imageSrc ?? previewUrl ?? null;

  if (currentImageSrc) {
    return (
      <UploadedImage
        imageSrc={currentImageSrc}
        onRemove={() => {
          setImageSrc(null);
          onRemoveImage?.();
        }}
      />
    );
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    onFileSelect(file);
    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    onFileSelect(file);
  };

  return (
    <div
      className={`h-36 border-dashed border flex flex-col gap-2 justify-center items-center relative rounded-md transition-colors ${
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-[#2563EB33] bg-[#2563EB0D]"
      }`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Button
        type="button"
        className="rounded-full w-9 h-9 bg-background"
        onClick={() => inputRef.current?.click()}
      >
        <Image color="#09090B" />
      </Button>
      <p className="text-sm font-medium">Choose a file or drag & drop it here</p>
      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP зураг оруулж болно</p>
      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={() => inputRef.current?.click()}
      >
        <Upload size={16} />
        Browse file
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
