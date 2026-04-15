"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  defaultImage?: string;
}

export default function ImageUpload({ onUploadSuccess, defaultImage }: ImageUploadProps) {
  const [previewUrl, setPreviewUrl] = useState(defaultImage || "");

  return (
    <div className="space-y-4">
      {/* Show image preview if it exists */}
      {previewUrl && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-slate-200">
          <Image 
            src={previewUrl} 
            alt="Upload preview" 
            fill 
            className="object-cover"
          />
        </div>
      )}

      {/* The Cloudinary Widget */}
      <CldUploadWidget
        signatureEndpoint="/api/upload-image"
        onSuccess={(result) => {
          if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
            const url = result.info.secure_url as string;
            setPreviewUrl(url);
            onUploadSuccess(url);
          }
        }}
        options={{
          multiple: false,
          resourceType: "image",
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-blue-50 transition"
          >
            <ImagePlus className="w-6 h-6 mr-2" />
            <span className="font-medium">
              {previewUrl ? "Change Image" : "Upload Cover Image"}
            </span>
          </button>
        )}
      </CldUploadWidget>
    </div>
  );
}
