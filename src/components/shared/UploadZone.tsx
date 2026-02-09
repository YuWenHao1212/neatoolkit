"use client";

import { useCallback, useRef, useState } from "react";
import { formatFileSize } from "@/lib/utils";

interface UploadZoneProps {
  accept: string;
  maxSize: number;
  label: string;
  hint: string;
  onFile: (file: File) => void;
  disabled?: boolean;
  preview?: React.ReactNode;
}

export default function UploadZone({
  accept,
  maxSize,
  label,
  hint,
  onFile,
  disabled = false,
  preview,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndEmit = useCallback(
    (file: File) => {
      setError(null);

      const acceptedTypes = accept.split(",").map((t) => t.trim());
      const isValidType = acceptedTypes.some((type) => {
        if (type.endsWith("/*")) {
          return file.type.startsWith(type.replace("/*", "/"));
        }
        return file.type === type;
      });

      if (!isValidType) {
        setError(`Unsupported file type: ${file.type}`);
        return;
      }

      if (file.size > maxSize) {
        setError(`File too large. Maximum: ${formatFileSize(maxSize)}`);
        return;
      }

      onFile(file);
    },
    [accept, maxSize, onFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) validateAndEmit(file);
    },
    [disabled, validateAndEmit],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndEmit(file);
      if (inputRef.current) inputRef.current.value = "";
    },
    [validateAndEmit],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`
        relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed
        px-6 py-12 text-center transition-colors
        ${isDragging ? "border-accent bg-accent-light/30" : "border-border bg-white"}
        ${disabled ? "pointer-events-none opacity-50" : "cursor-pointer hover:border-accent/50"}
      `}
      onClick={() => !disabled && inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {preview || (
        <>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-4 text-ink-600/40"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <p className="text-base font-medium text-ink-900">{label}</p>
          <p className="mt-1 text-sm text-ink-500">{hint}</p>
        </>
      )}

      {error && (
        <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}
    </div>
  );
}
