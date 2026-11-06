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
    <div className="portrait-fade">
      <Image
        src={profile.photo}
        alt={alt}
        width={736}
        height={920}
        priority={priority}
        className="h-auto w-full grayscale contrast-[1.16] brightness-[1.02] mix-blend-multiply"
      />
    </div>
  );
}
