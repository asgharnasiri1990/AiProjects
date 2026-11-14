import type { IconKey } from "@/lib/types";

const shapes: Record<IconKey, React.ReactNode> = {
  phone: (
    <>
      <rect x="46" y="22" width="68" height="156" rx="16" />
      <rect x="52" y="28" width="56" height="144" rx="11" />
      <rect x="68" y="34" width="24" height="7" rx="3.5" />
      <path d="M70 166h20" />
      <path d="M114 62v14M114 86v10" />
    </>
  ),
  watch: (
    <>
      <rect x="50" y="54" width="60" height="92" rx="20" />
      <path d="M64 54V30h32v24M64 146v24h32v-24" />
      <circle cx="80" cy="100" r="20" />
      <path d="M110 88v10" />
    </>
  ),
  earbuds: (
    <>
      <rect x="34" y="92" width="92" height="64" rx="20" />
      <path d="M34 114h92" />
      <path d="M56 92V70a10 10 0 0 1 20 0v22M84 92V70a10 10 0 0 1 20 0v22" />
      <path d="M66 128h28" />
    </>
  ),
  charger: (
    <>
      <rect x="44" y="58" width="72" height="72" rx="18" />
      <path d="M62 58V38M98 58V38" />
      <path d="M86 78l-12 18h12l-6 16" />
      <rect x="70" y="112" width="20" height="7" rx="2" />
    </>
  ),
  cable: (
    <>
      <rect x="64" y="20" width="32" height="38" rx="7" />
      <path d="M72 30h16M72 38h16" />
      <path d="M80 58v18c0 28 28 22 28 46v10" />
      <rect x="94" y="132" width="28" height="38" rx="7" />
      <path d="M102 142h12M102 150h12" />
    </>
  ),
  powerbank: (
    <>
      <rect x="50" y="28" width="60" height="144" rx="14" />
      <circle cx="66" cy="46" r="3" />
      <circle cx="78" cy="46" r="3" />
      <circle cx="90" cy="46" r="3" />
      <path d="M86 82 74 104h12l-6 18" />
      <rect x="60" y="150" width="16" height="7" rx="2" />
      <rect x="84" y="150" width="16" height="7" rx="2" />
    </>
  ),
  case: (
    <>
      <rect x="46" y="22" width="68" height="156" rx="18" />
      <rect x="54" y="30" width="34" height="34" rx="10" />
      <circle cx="64" cy="40" r="4.5" />
      <circle cx="76" cy="52" r="4.5" />
      <path d="M106 60v10" />
    </>
  ),
  protector: (
    <>
      <rect x="46" y="22" width="68" height="156" rx="12" />
      <path d="M56 156 106 44M72 166 118 60" />
      <path d="M54 34h14" />
    </>
  ),
};

export function ProductArt({
  icon,
  className,
}: {
  icon: IconKey;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 160 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {shapes[icon]}
    </svg>
  );
}
