"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";
import {
  addPropertyImagesAction,
  deletePropertyImageAction,
} from "@/app/actions/properties";

interface ImageRecord {
  id: string;
  url: string;
}

export function PropertyImagesManager({
  propertyId,
  initialImages,
}: {
  propertyId: string;
  initialImages: ImageRecord[];
}) {
  const [images, setImages] = useState(initialImages);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  function removeImage(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
    startTransition(async () => {
      await deletePropertyImageAction(id, propertyId);
      router.refresh();
    });
  }

  return (
    <div>
      {images.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((img) => (
            <div
              key={img.id}
              className="group relative aspect-square overflow-hidden rounded-sm border border-stone-line"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-stone opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Supprimer cette photo"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <UploadDropzone
        endpoint="propertyImage"
        onClientUploadComplete={(res) => {
          setError(null);
          const urls = res.map((f) => f.ufsUrl);
          startTransition(async () => {
            await addPropertyImagesAction(propertyId, urls);
            router.refresh();
          });
          // optimistic local render (ids are temp, refresh will reconcile)
          setImages((prev) => [
            ...prev,
            ...urls.map((url) => ({ id: `pending-${url}`, url })),
          ]);
        }}
        onUploadError={(err) => setError(err.message)}
        appearance={{
          container: "rounded-sm border-stone-line bg-stone-100 p-4",
          label: "text-ink text-sm",
          allowedContent: "text-ink-60 text-xs",
          button:
            "bg-pine text-stone text-sm ut-uploading:bg-pine-dark ut-readying:bg-pine-dark",
        }}
      />
      {error && (
        <p className="mt-2 rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">
          {error}
        </p>
      )}
    </div>
  );
}
