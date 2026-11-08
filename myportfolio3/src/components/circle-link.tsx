import { ArrowDownIcon, ArrowUpRightIcon } from "@/components/icons";
import { focusRing } from "@/lib/styles";

export function CircleLink({
  href,
  label,
  external = false,
  icon = "arrow",
  size = "lg",
  onDark = false,
  className = "",
}: {
  href: string;
  label: string;
  external?: boolean;
  icon?: "arrow" | "down";
  size?: "sm" | "lg";
  /** For the ink strip inside the lime hero: lime outline instead of ink. */
  onDark?: boolean;
  className?: string;
}) {
  const sizeClass = size === "sm" ? "h-9 w-9" : "h-14 w-14";
  const iconSize = size === "sm" ? 14 : 18;
  const tone = onDark
    ? "border-signal/40 text-signal hover:border-signal hover:bg-signal hover:text-signal-ink"
    : "border-ink/25 text-ink hover:border-signal hover:bg-signal hover:text-signal-ink";

  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-grid shrink-0 place-items-center rounded-full border transition-colors ${tone} ${sizeClass} ${focusRing} ${className}`}
    >
      {icon === "down" ? (
        <ArrowDownIcon width={iconSize} height={iconSize} />
      ) : (
        <ArrowUpRightIcon
          width={iconSize}
          height={iconSize}
          className="transition-transform duration-300 group-hover:rotate-45"
        />
      )}
    </a>
  );
}
