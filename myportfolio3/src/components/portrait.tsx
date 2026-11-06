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
    <Image
      src={profile.photo}
      alt={alt}
      width={920}
      height={1150}
      priority={priority}
      className="portrait-bottom-fade h-auto w-full grayscale"
    />
  );
}
