import Image from "next/image";
import { profile } from "@/content/profile";

export function Portrait({
  alt,
  priority = false,
}: {
  alt: string;
  priority?: boolean;
}) {
  return (
    <div className="relative aspect-square w-full overflow-hidden rounded-full border border-line bg-wash">
      <Image
        src={profile.photo}
        alt={alt}
        fill
        priority={priority}
        sizes="(min-width: 768px) 400px, 80vw"
        className="object-cover object-[center_28%] grayscale"
      />
    </div>
  );
}
