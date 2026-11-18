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
        // Max dimension 1200px to keep payload lightweight and fast
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
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            dragActive
              ? "border-emerald-500 bg-emerald-50/50 scale-[0.99]"
              : "border-slate-300 bg-white hover:border-emerald-400 hover:bg-slate-50/50"
          }`}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 shadow-inner">
            <ImageIcon className="h-8 w-8" />
          </div>

          <h3 className="text-base font-semibold text-slate-800">
            Snap or upload your meal photo
          </h3>
          <p className="mt-1 max-w-sm text-xs text-slate-500 leading-relaxed">
            Drag and drop an image here, or choose an option below. For best accuracy, capture the whole plate clearly under good lighting.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95"
            >
              <Camera className="h-4 w-4" />
              <span>Take Photo</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 hover:text-slate-900 transition active:scale-95"
            >
              <Upload className="h-4 w-4 text-slate-500" />
              <span>Browse Files</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          {previewUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-slate-900/5">
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
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur hover:bg-slate-900 transition disabled:opacity-50"
                title="Remove photo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {useSampleData && !previewUrl && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-5 text-center">
              <Sparkles className="mx-auto h-7 w-7 text-emerald-600 mb-2" />
              <p className="text-sm font-semibold text-emerald-900">
                Sample Mode Activated
              </p>
              <p className="text-xs text-emerald-700 mt-1">
                You can test the complete nutritional estimate & save flow immediately with sample meal data.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode Toggle & Action Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={useSampleData}
            onChange={(e) => setUseSampleData(e.target.checked)}
            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          <span>Use sample meal data (test without consuming API key)</span>
        </label>

        <button
          type="button"
          onClick={handleStartAnalysis}
          disabled={isLoading || (!imagePayload && !useSampleData)}
          className={`flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white shadow-md transition-all ${
            isLoading || (!imagePayload && !useSampleData)
              ? "bg-slate-300 cursor-not-allowed text-slate-500 shadow-none"
              : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 active:scale-95"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Analyzing Meal with AI...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              <span>Estimate Nutrition</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
