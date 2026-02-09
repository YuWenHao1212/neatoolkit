"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import UploadZone from "@/components/shared/UploadZone";
import { fetchApi, ApiError } from "@/lib/api";
import { formatFileSize } from "@/lib/utils";

type Status = "idle" | "compressing" | "done" | "error";
type Quality = "low" | "medium" | "high";

interface CompressResult {
  url: string;
  originalSize: number;
  compressedSize: number;
  width: number;
  height: number;
}

export default function ImageCompress() {
  const t = useTranslations("ImageCompress");

  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<Quality>("medium");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<CompressResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isWarmingUp, setIsWarmingUp] = useState(false);

  const handleFile = useCallback((f: File) => {
    setFile(f);
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
  }, []);

  const handleCompress = useCallback(async () => {
    if (!file) return;

    setStatus("compressing");
    setErrorMsg("");
    setIsWarmingUp(false);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("quality", quality);

    try {
      const response = await fetchApi("/api/image/compress", formData, {
        timeout: 30000,
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      setResult({
        url,
        originalSize: Number(response.headers.get("x-original-size") || 0),
        compressedSize: Number(response.headers.get("x-compressed-size") || 0),
        width: Number(response.headers.get("x-width") || 0),
        height: Number(response.headers.get("x-height") || 0),
      });
      setStatus("done");
    } catch (error) {
      if (error instanceof ApiError && (error.status === 503 || error.status === 408)) {
        setIsWarmingUp(true);
        setErrorMsg(t("warmingUp"));
      } else if (error instanceof ApiError) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg(t("unknownError"));
      }
      setStatus("error");
    }
  }, [file, quality, t]);

  const handleRetry = useCallback(() => {
    handleCompress();
  }, [handleCompress]);

  const handleReset = useCallback(() => {
    if (result?.url) URL.revokeObjectURL(result.url);
    setFile(null);
    setResult(null);
    setStatus("idle");
    setErrorMsg("");
    setIsWarmingUp(false);
  }, [result]);

  const savingsPercent =
    result && result.originalSize > 0
      ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
      : 0;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left: Upload + Controls */}
      <div className="flex flex-col gap-6">
        <UploadZone
          accept="image/jpeg,image/png,image/webp"
          maxSize={10 * 1024 * 1024}
          label={t("uploadLabel")}
          hint={t("uploadHint")}
          onFile={handleFile}
          disabled={status === "compressing"}
          preview={
            file ? (
              <div className="flex flex-col items-center gap-2">
                <p className="text-base font-medium text-ink-900">{file.name}</p>
                <p className="text-sm text-ink-500">{formatFileSize(file.size)}</p>
              </div>
            ) : undefined
          }
        />

        {/* Quality selector */}
        {file && (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-ink-700">
              {t("qualityLabel")}
            </label>
            <div className="flex gap-2">
              {(["low", "medium", "high"] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQuality(q)}
                  className={`
                    rounded-lg px-4 py-2 text-sm font-medium transition-colors
                    ${quality === q
                      ? "bg-accent text-white"
                      : "bg-cream-200 text-ink-600 hover:bg-cream-300"
                    }
                  `}
                >
                  {t(`quality.${q}`)}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleCompress}
              disabled={status === "compressing"}
              className="mt-2 rounded-xl bg-accent px-6 py-3 text-base font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
            >
              {status === "compressing" ? t("compressing") : t("compressBtn")}
            </button>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="text-sm text-red-700">{errorMsg}</p>
            <button
              type="button"
              onClick={isWarmingUp ? handleRetry : handleRetry}
              className="mt-2 text-sm font-medium text-red-700 underline hover:text-red-800"
            >
              {t("retry")}
            </button>
          </div>
        )}
      </div>

      {/* Right: Result */}
      <div className="flex flex-col gap-4">
        {status === "compressing" && (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-white px-6 py-16">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-accent border-t-transparent" />
            <p className="mt-4 text-sm text-ink-600">{t("compressing")}</p>
          </div>
        )}

        {status === "done" && result && (
          <div className="rounded-2xl border border-border bg-white p-6">
            <div className="mb-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-sm text-ink-500">{t("originalSize")}</p>
                <p className="text-lg font-semibold text-ink-900">
                  {formatFileSize(result.originalSize)}
                </p>
              </div>
              <div>
                <p className="text-sm text-ink-500">{t("compressedSize")}</p>
                <p className="text-lg font-semibold text-accent">
                  {formatFileSize(result.compressedSize)}
                </p>
              </div>
              <div>
                <p className="text-sm text-ink-500">{t("savings")}</p>
                <p className="text-lg font-semibold text-green-600">
                  -{savingsPercent}%
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <a
                href={result.url}
                download={`compressed-${file?.name || "image"}`}
                className="flex-1 rounded-xl bg-accent px-4 py-3 text-center text-base font-semibold text-white transition-colors hover:bg-accent-hover"
              >
                {t("download")}
              </a>
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-border px-4 py-3 text-base font-medium text-ink-600 transition-colors hover:bg-cream-200"
              >
                {t("reset")}
              </button>
            </div>
          </div>
        )}

        {status === "idle" && !file && (
          <div className="hidden flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-cream-200/50 px-6 py-16 lg:flex">
            <p className="text-sm text-ink-500">{t("resultPlaceholder")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
