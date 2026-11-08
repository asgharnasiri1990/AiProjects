import { ArrowDownIcon, ArrowUpRightIcon } from "@/components/icons";
import { focusRing } from "@/lib/styles";

export function CircleLink({
  href,
  label,
  external = false,
  icon = "arrow",
  size = "lg",
  className = "",
}: {
  href: string;
  label: string;
  external?: boolean;
  icon?: "arrow" | "down";
  size?: "sm" | "lg";
  className?: string;
}) {
  const sizeClass = size === "sm" ? "h-9 w-9" : "h-14 w-14";
  const iconSize = size === "sm" ? 14 : 18;

  return (
    <a
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`group inline-grid shrink-0 place-items-center rounded-full border border-[#7c3aed]/30 text-[#7c3aed] transition-colors hover:border-[#7c3aed] hover:bg-[#7c3aed] hover:text-white ${sizeClass} ${focusRing} ${className}`}
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
