import Image from "next/image";

/**
 * Project cover photo. The image is decorative — the card already names the
 * project — so it carries an empty alt. The index badge keeps the editorial
 * numbering from the old drawn covers.
 */
export function ProjectArt({
  index,
  src,
  className = "",
  showIndex = true,
  priority = false,
  sizes = "(min-width: 1024px) 512px, (min-width: 640px) 45vw, 100vw",
}: {
  index: string;
  src: string;
  className?: string;
  showIndex?: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-line bg-wash ${className}`}
    >
      <Image
        src={src}
        alt=""
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      />
      {showIndex ? (
        <span
          aria-hidden
          className="absolute bottom-3 start-3 rounded-full bg-canvas/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-ink backdrop-blur"
        >
          {index}
        </span>
      ) : null}
    </div>
  );
}
