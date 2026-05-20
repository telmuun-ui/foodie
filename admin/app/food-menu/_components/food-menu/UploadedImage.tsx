"use client";
import { X } from "lucide-react";
import Image from "next/image";

type UploadedImageProps = {
  imageSrc: string;
  onRemove: () => void;
};

export const UploadedImage = ({ imageSrc, onRemove }: UploadedImageProps) => {
  return (
    <div className="h-36 border-dashed border border-[#2563EB33] bg-[#2563EB0D] relative rounded-md overflow-hidden">
      <Image src={imageSrc} alt="Uploaded Image" fill className="object-cover" />
     
      <button type="button" className="bg-background absolute z-10 right-4 top-4 p-2 rounded-full shadow-sm" onClick={onRemove}>
        <X size={14} color="#18181B" strokeWidth={1.5} />
      </button>
    </div>
  );
};
