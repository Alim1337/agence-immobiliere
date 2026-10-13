import { PropertyPhoto } from "./property-photo";

interface ImageLike {
  url: string;
}

export function PropertyImage({
  images,
  index = 0,
  alt = "",
  className,
}: {
  images: ImageLike[];
  index?: number;
  alt?: string;
  className?: string;
}) {
  const image = images[index];
  if (!image) return <PropertyPhoto className={className} />;

  // eslint-disable-next-line @next/next/no-img-element
  return <img src={image.url} alt={alt} className={`${className ?? ""} object-cover`} />;
}
