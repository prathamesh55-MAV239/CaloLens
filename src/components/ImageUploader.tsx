"use client";

import React, { useState, useRef } from "react";
import { Upload, Camera, Sparkles, Image as ImageIcon, X, RefreshCw } from "lucide-react";

interface ImageUploaderProps {
  onAnalyze: (imageData: { base64: string; mimeType: string }, useMock: boolean) => void;
  isLoading: boolean;
}

export function ImageUploader({ onAnalyze, isLoading }: ImageUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imagePayload, setImagePayload] = useState<{ base64: string; mimeType: string } | null>(null);
  const [useSampleData, setUseSampleData] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Compress & convert file to Base64
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file (JPEG, PNG, WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 1200;
        let { width, height } = img;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64Data = compressedDataUrl.split(",")[1];

        setPreviewUrl(compressedDataUrl);
        setImagePayload({
          base64: base64Data,
          mimeType: "image/jpeg",
        });
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setImagePayload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleStartAnalysis = () => {
    if (useSampleData) {
      onAnalyze({ base64: "", mimeType: "image/jpeg" }, true);
      return;
    }
    if (!imagePayload) {
      alert("Please take a photo or select an image first.");
      return;
    }
    onAnalyze(imagePayload, false);
  };

  return (
    <div className="w-full space-y-4">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Upload Box / Image Preview */}
      {!previewUrl && !useSampleData ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 sm:p-12 text-center transition-all ${
            dragActive
              ? "border-[#B30D08] bg-[#FFE1AC]/40 scale-[0.99]"
              : "border-[#F9A83B]/80 bg-[#FFF3DF] hover:border-[#FF990F] hover:bg-[#FFE1AC]/20 shadow-warm"
          }`}
        >
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#FF990F] to-[#FFA82F] text-white shadow-lg shadow-[#FF990F]/30 ring-4 ring-[#FFE1AC]">
            <Camera className="h-9 w-9 stroke-[2.2]" />
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#8D240D]">
            Snap or Upload Your Meal Photo
          </h3>
          <p className="mt-1.5 max-w-md text-xs sm:text-sm text-[#65230F] leading-relaxed">
            Drag and drop an image here or take a live photo. For best visual estimation, capture the entire plate under clear lighting.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 rounded-full bg-[#B30D08] px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white shadow-md shadow-[#B30D08]/30 hover:bg-[#8D240D] transition active:scale-95"
            >
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-full border border-[#FFE1AC] bg-[#FFF8EC] px-5 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#8D240D] shadow-warm-sm hover:bg-[#FFE1AC]/40 transition active:scale-95"
            >
              <Upload className="h-4 w-4 text-[#FF990F]" />
              <span>Browse Files</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-3xl border border-[#FFE1AC] bg-[#FFF3DF] p-4 sm:p-5 shadow-warm">
          {previewUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#8D240D]/5 border border-[#FFE1AC]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Meal Preview"
                className="h-full w-full object-cover"
              />
              <button
                type="button"
                onClick={clearImage}
                disabled={isLoading}
                className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-[#8D240D]/80 text-white backdrop-blur hover:bg-[#8D240D] transition disabled:opacity-50 shadow-md"
                title="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {useSampleData && !previewUrl && (
            <div className="rounded-2xl border border-[#FFE1AC] bg-[#FFF8EC] p-6 text-center shadow-warm-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFE1AC] text-[#8D240D] mb-3">
                <Sparkles className="h-6 w-6 text-[#FF990F]" />
              </div>
              <h4 className="font-display text-lg font-black uppercase tracking-tight text-[#8D240D]">
                Sample Mode Activated
              </h4>
              <p className="text-xs text-[#65230F] mt-1 max-w-sm mx-auto leading-relaxed">
                Experience the full nutritional estimation, portion adjustment, and meal saving workflow instantly with sample dish data.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode Toggle & Primary Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3.5 pt-1">
        <label className="flex items-center gap-2.5 text-xs font-semibold text-[#8D240D] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useSampleData}
            onChange={(e) => setUseSampleData(e.target.checked)}
            className="rounded border-[#F9A83B] text-[#B30D08] focus:ring-[#B30D08] h-4 w-4"
          />
          <span>Use sample meal data (test without consuming API credits)</span>
        </label>

        <button
          type="button"
          onClick={handleStartAnalysis}
          disabled={isLoading || (!imagePayload && !useSampleData)}
          className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-full px-7 py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all ${
            isLoading || (!imagePayload && !useSampleData)
              ? "bg-[#FFE1AC] text-[#8E513F] cursor-not-allowed shadow-none"
              : "bg-[#B30D08] hover:bg-[#8D240D] shadow-md shadow-[#B30D08]/30 active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
              <span>Analyzing Meal with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-[#FFC84B]" />
              <span>Estimate Nutrition</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
