"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

export function ImageUploader({
  name,
  initialUrls = [],
}: {
  name: string;
  initialUrls?: string[];
}) {
  const [urls, setUrls] = useState<string[]>(initialUrls);
  const [error, setError] = useState<string | null>(null);

  function removeUrl(url: string) {
    setUrls((prev) => prev.filter((u) => u !== url));
  }

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />

      {urls.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {urls.map((url) => (
            <div key={url} className="group relative aspect-square overflow-hidden rounded-sm border border-stone-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeUrl(url)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/70 text-stone opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Retirer cette photo"
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
          setUrls((prev) => [...prev, ...res.map((f) => f.ufsUrl)]);
        }}
        onUploadError={(err) => {
          setError(err.message);
        }}
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
