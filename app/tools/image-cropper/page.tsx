"use client";


import AdsterraAd from "@/components/AdsterraAd";
import Link from "next/link";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { ChangeEvent, useRef, useState } from "react";

type AspectOption = {
  label: string;
  value: number | undefined;
};

const aspectOptions: AspectOption[] = [
  { label: "Free", value: undefined },
  { label: "1:1", value: 1 },
  { label: "4:3", value: 4 / 3 },
  { label: "16:9", value: 16 / 9 },
];

export default function ImageCropper() {
  const [image, setImage] = useState("");
  const [croppedImage, setCroppedImage] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [fileName, setFileName] = useState("quicktools-cropped-image.jpg");
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = () => {
      setImage(String(reader.result));
      setCroppedImage("");
      setCrop(undefined);
      setCompletedCrop(undefined);
      setFileName(
        `quicktools-${file.name.replace(/\.[^/.]+$/, "")}-cropped.jpg`
      );
    };

    reader.readAsDataURL(file);
  };

  const handleImageLoad = (event: React.SyntheticEvent<HTMLImageElement>) => {
    imageRef.current = event.currentTarget;

    const { naturalWidth, naturalHeight } = event.currentTarget;

    const initialWidth = Math.min(naturalWidth, 800);
    const initialHeight = Math.min(naturalHeight, 500);

    setCrop({
      unit: "px",
      x: Math.max(0, (naturalWidth - initialWidth) / 2),
      y: Math.max(0, (naturalHeight - initialHeight) / 2),
      width: initialWidth,
      height: initialHeight,
    });
  };

  const createCroppedImage = async () => {
    if (!imageRef.current || !completedCrop) return;

    const cropped = await getCroppedImg(imageRef.current, completedCrop);

    if (cropped) {
      setCroppedImage(cropped);
    }
  };

  const downloadImage = () => {
    if (!croppedImage) return;

    const link = document.createElement("a");
    link.href = croppedImage;
    link.download = fileName;
    link.click();
  };

  const clearAll = () => {
    setImage("");
    setCroppedImage("");
    setCrop(undefined);
    setCompletedCrop(undefined);
    imageRef.current = null;
  };

  const handleAspectChange = (value: number | undefined) => {
    setAspect(value);
    setCroppedImage("");

    if (!imageRef.current) return;

    const { naturalWidth, naturalHeight } = imageRef.current;
    const width = Math.min(naturalWidth, 800);
    const height = value ? width / value : Math.min(naturalHeight, 500);

    setCrop({
      unit: "px",
      x: Math.max(0, (naturalWidth - width) / 2),
      y: Math.max(0, (naturalHeight - height) / 2),
      width: Math.min(width, naturalWidth),
      height: Math.min(height, naturalHeight),
    });
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            â† Back
          </Link>

          <Link
            href="/"
            className="rounded-xl border px-4 py-2 text-sm font-medium transition hover:bg-muted"
          >
            Home
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Image Cropper</h1>
          <p className="mt-3 text-muted-foreground">
            Crop your images online quickly and easily.
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-5 shadow-sm">
          {!image ? (
            <label className="flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition hover:bg-muted/50">
              <span className="text-lg font-semibold">Upload an image</span>
              <span className="mt-2 text-sm text-muted-foreground">
                JPG, PNG, WebP and other common image formats
              </span>

              <span className="mt-5 rounded-xl border px-5 py-3 text-sm font-medium">
                Choose Image
              </span>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          ) : (
            <>
              <div className="flex min-h-[420px] items-center justify-center overflow-auto rounded-xl bg-black p-4">
                <ReactCrop
                  crop={crop}
                  onChange={(nextCrop) => setCrop(nextCrop)}
                  onComplete={(nextCrop) => setCompletedCrop(nextCrop)}
                  aspect={aspect}
                  keepSelection
                  minWidth={20}
                  minHeight={20}
                >
                  <img
                    ref={imageRef}
                    src={image}
                    alt="Image to crop"
                    onLoad={handleImageLoad}
                    className="max-h-[390px] max-w-full object-contain"
                  />
                </ReactCrop>
              </div>

              <div className="mt-6">
                <p className="text-sm font-medium">Aspect Ratio</p>

                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {aspectOptions.map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => handleAspectChange(option.value)}
                      className={`rounded-xl border px-4 py-3 text-sm font-medium transition hover:bg-muted ${
                        aspect === option.value ? "bg-muted" : ""
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                Drag the crop area or drag its edges and corners to choose
                exactly what you want to keep.
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <button
                  type="button"
                  onClick={createCroppedImage}
                  className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
                >
                  Crop Image
                </button>

                <button
                  type="button"
                  onClick={downloadImage}
                  disabled={!croppedImage}
                  className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Download
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="rounded-xl border px-4 py-3 font-medium transition hover:bg-muted"
                >
                  Clear
                </button>
              </div>

              {croppedImage && (
                <div className="mt-6">
                  <p className="mb-3 text-sm font-medium">Cropped Image</p>

                  <div className="flex justify-center rounded-xl border bg-muted/20 p-5">
                    <img
                      src={croppedImage}
                      alt="Cropped preview"
                      className="max-h-[400px] max-w-full rounded-lg object-contain"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>


        <AdsterraAd />
        <section className="mt-12">
          <h2 className="text-2xl font-bold">Free online image cropper</h2>

          <p className="mt-4 leading-7 text-muted-foreground">
            Crop images directly in your browser without installing software.
            Upload an image, adjust the crop area by dragging its edges or
            corners, choose an aspect ratio, and download the cropped image
            instantly.
          </p>
        </section>
      </div>
    </main>
  );
}

function getCroppedImg(
  image: HTMLImageElement,
  pixelCrop: PixelCrop
): Promise<string | null> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      resolve(null);
      return;
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = Math.round(pixelCrop.width * scaleX);
    canvas.height = Math.round(pixelCrop.height * scaleY);

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    resolve(canvas.toDataURL("image/jpeg", 0.92));
  });
}

