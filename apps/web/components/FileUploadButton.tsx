"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { uploadFile } from "@/lib/upload";
import Image from "next/image";

interface FileUploadButtonProps {
  accept: string;
  onUpload: (url: string) => void;
  maxSizeMB?: number;
  label?: string;
  preview?: boolean;
  multiple?: boolean;
}

export function FileUploadButton({
  accept,
  onUpload,
  maxSizeMB = 50,
  label = "Upload File",
  preview = true,
  multiple = false,
}: FileUploadButtonProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File too large. Max ${maxSizeMB}MB`);
        return;
      }

      if (preview && file.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(file));
      }

      setUploading(true);
      try {
        const url = await uploadFile(file);
        onUpload(url);
        if (!file.type.startsWith("image/")) {
          setPreviewUrl(null);
        }
      } catch (err: any) {
        setError(err.message || "Upload failed");
        setPreviewUrl(null);
      } finally {
        setUploading(false);
      }
    },
    [maxSizeMB, onUpload, preview]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (let i = 0; i < files.length; i++) {
      handleFile(files[i]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    for (let i = 0; i < files.length; i++) {
      handleFile(files[i]);
    }
  };

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`w-full py-4 bg-neutral-800 hover:bg-neutral-700 border border-dashed rounded-lg flex flex-col items-center justify-center gap-2 text-neutral-400 transition-colors cursor-pointer ${
          dragOver ? "border-accent bg-accent/10" : "border-neutral-600"
        }`}
      >
        {uploading ? (
          <Loader2 size={20} className="animate-spin text-accent" />
        ) : (
          <Upload size={20} />
        )}
        <span className="text-sm">
          {uploading ? "Uploading..." : label}
        </span>
        <span className="text-xs text-neutral-500">
          Max {maxSizeMB}MB. Drag & drop or click.
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      {previewUrl && preview && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10">
          <Image src={previewUrl} alt="Preview" fill className="object-cover" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setPreviewUrl(null);
            }}
            className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white hover:bg-black/80"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
