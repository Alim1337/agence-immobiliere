"use client";

import { useState } from "react";
import { UploadDropzone } from "@/lib/uploadthing";

export function LogoUploader({
  name,
  initialUrl,
}: {
  name: string;
  initialUrl?: string | null;
}) {
  const [url, setUrl] = useState<string | undefined>(initialUrl ?? undefined);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <input type="hidden" name={name} value={url ?? ""} />
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="Logo" className="mb-3 h-14 w-auto rounded-sm border border-stone-line bg-white p-2" />
      )}
      <UploadDropzone
        endpoint="propertyImage"
        onClientUploadComplete={(res) => {
          setError(null);
          if (res[0]) setUrl(res[0].ufsUrl);
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
