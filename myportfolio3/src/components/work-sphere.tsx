"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copy } from "@/content/copy";
import { work, type WorkItem } from "@/content/work";
import type { Locale } from "@/lib/i18n";
import { displayTracking, focusRing, labelStyle, latinTracking } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";
import { CircleLink } from "@/components/circle-link";

/**
 * Placeholder previews. These are the default stills from the archive; swap the
 * array (or the `image` field in content/work.ts) once the real screenshots land.
 */
const CDN =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/";

const DEFAULT_IMAGES = [
  "hf_20260922_194349_26ffdbfd-ac5e-49e9-a07d-c06d3f7cb4cb",
  "hf_20260922_194350_5546ea3d-6336-42c7-a59f-06165c5802be",
  "hf_20260922_194349_b4533691-cb49-41d4-b56c-51f0fdcbe250",
  "hf_20260922_194350_28d92c80-de66-41cb-911e-b3b44aebe1f5",
  "hf_20260922_194349_04e89718-4214-4aff-bac5-490462bbfe2f",
  "hf_20260922_194417_2c031e22-2fad-4c81-a544-83cd6bba1c33",
  "hf_20260922_194349_a39c3226-7848-4b15-b840-98ad8aec467b",
  "hf_20260922_194417_555e4d90-f35f-4a1a-8c75-def1e8b71988",
  "hf_20260922_194417_e525a243-03c8-454b-83b4-60f541baf70a",
  "hf_20260922_194416_30e307a9-1265-45c3-a1a0-5c6fa5bb9f8d",
];

function previewFor(index: number) {
  return `${CDN}${DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]}_min.webp`;
}

function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}

export function WorkSphere({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const items = work;
  const N = items.length;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const suppressClick = useRef(false);
  const activeRef = useRef<number | null>(null);

  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const vecs = useMemo(() => {
    const GA = Math.PI * (3 - Math.sqrt(5));
    return items.map((_, index) => {
      const y = 1 - (index / (N - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = index * GA;
      const x = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      return {
        x,
        y,
        z,
        lat: (Math.asin(y) * 180) / Math.PI,
        lon: (Math.atan2(x, z) * 180) / Math.PI,
      };
    });
  }, [items, N]);

  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world) return;

    const worldEl = world;

    let R = 200;
    let radius = 200;
    let perspective = 1000;
    let frame = 0;

    const state = { dx: 16, dy: 10, vx: 0, vy: 0, tilt: -6 };
    let drag: {
      id: number;
      x: number;
      y: number;
      lx: number;
      ly: number;
      moved: number;
    } | null = null;

    function layout() {
      if (!stage) return;
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      radius = Math.max(
        130,
        Math.min(340, Math.min(width * 0.4, height * 0.46)),
      );
      R = radius;

      const scale = width <= 640 ? 0.58 : 0.5;
      const cw = Math.round(Math.max(84, radius * scale));
      perspective = width <= 640 ? 720 : 1000;

      stage.style.setProperty("--cw", `${cw}px`);
      stage.style.setProperty("--persp", `${perspective}px`);
      stage.style.setProperty(
        "--hw",
        `${Math.round(Math.min(width * 0.76, 460))}px`,
      );

      vecs.forEach((v, index) => {
        const el = cardRefs.current[index];
        if (!el) return;
        el.style.transform =
          `translate3d(${v.x * R}px, ${-v.y * R}px, ${v.z * R}px) ` +
          `rotateY(${v.lon}deg) rotateX(${v.lat}deg)`;
      });
    }

    function clampPitch() {
      state.dy = clamp(state.dy, -30 - state.tilt, 30 - state.tilt);
    }

    function tick() {
      if (!drag && activeRef.current === null) {
        state.dx += state.vx;
        state.dy += state.vy;
        state.vx *= 0.94;
        state.vy *= 0.94;
        if (Math.abs(state.vx) < 0.002) state.vx = 0;
        if (Math.abs(state.vy) < 0.002) state.vy = 0;
        clampPitch();
      }

      const sy = state.dx;
      const sx = state.tilt + state.dy;

      worldEl.style.transform = `rotateY(${sy}deg) rotateX(${sx}deg)`;

      const rx = (sx * Math.PI) / 180;
      const ry = (sy * Math.PI) / 180;
      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      vecs.forEach((v, index) => {
        const el = cardRefs.current[index];
        if (!el) return;

        const py = -v.y;
        const z1 = py * sinX + v.z * cosX;
        const z2 = -v.x * sinY + z1 * cosY;

        const base = 0.1 + 0.9 * Math.pow((z2 + 1) / 2, 0.9);
        const opacity = (0.34 + 0.66 * base).toFixed(3);

        if (el.dataset.o !== opacity) {
          el.style.opacity = opacity;
          el.dataset.o = opacity;
        }
      });

      frame = requestAnimationFrame(tick);
    }

    function onDown(event: PointerEvent) {
      if (activeRef.current !== null) return;
      drag = {
        id: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        lx: event.clientX,
        ly: event.clientY,
        moved: 0,
      };
      suppressClick.current = false;
    }

    function onMove(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.lx;
      const dy = event.clientY - drag.ly;
      drag.lx = event.clientX;
      drag.ly = event.clientY;

      state.dx += dx * 0.22;
      state.dy += dy * 0.18;
      state.vx = dx * 0.22;
      state.vy = dy * 0.18;
      clampPitch();

      drag.moved = Math.max(
        drag.moved,
        Math.abs(event.clientX - drag.x) + Math.abs(event.clientY - drag.y),
      );
      if (drag.moved > 6) suppressClick.current = true;
    }

    function onUp(event: PointerEvent) {
      if (!drag || event.pointerId !== drag.id) return;
      drag = null;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    }

    layout();
    frame = requestAnimationFrame(tick);

    stage.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [vecs]);

  useEffect(() => {
    activeRef.current = active;
    if (active === null) {
      document.documentElement.style.overflow = "";
      return;
    }
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [active]);

  const current: WorkItem | null = active === null ? null : items[active];

  return (
    <div className="mt-6 sm:mt-10">
      <div
        ref={stageRef}
        className="relative mx-auto h-[clamp(380px,62vh,620px)] w-full touch-pan-y select-none"
        style={{
          perspective: "var(--persp, 1000px)",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <div
          ref={worldRef}
          className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
        >
          {items.map((item, index) => (
            <button
              key={item.slug}
              type="button"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => {
                if (suppressClick.current) return;
                setActive(index);
              }}
              aria-label={`${item.title[locale]} â€” ${c.workSource}`}
              className={`group absolute left-0 top-0 rounded-[3px] focus-visible:outline-none ${focusRing}`}
              style={{
                width: "var(--cw)",
                height: "calc(var(--cw) / 1.5)",
                marginLeft: "calc(var(--cw) / -2)",
                marginTop: "calc(var(--cw) / -3)",
              }}
            >
              <span className="pointer-events-none relative block h-full w-full overflow-hidden rounded-[3px] border border-line bg-wash">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewFor(index)}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover grayscale transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute bottom-1.5 start-1.5 rounded-full bg-signal px-1.5 py-0.5 font-mono text-[9px] leading-none text-signal-ink">
                  {item.index}
                </span>
              </span>
            </button>
          ))}

        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <h2
            className={`max-w-[80%] text-center font-display text-[clamp(1.45rem,4vw,2.6rem)] font-semibold leading-none text-ink ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
            style={{ textShadow: "0 2px 30px var(--color-paper)" }}
          >
            {c.workLabel}
          </h2>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:mt-6">
        <span
          className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}
        >
          {c.workRotate}
        </span>
        <CircleLink
          href="https://github.com/asgharnasiri1990/AiProjects"
          label={`${c.workRepos} â€” ${c.externalLink}`}
          external
        />
      </div>

      {current ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.title[locale]}
          className="fixed inset-0 z-[120] flex items-end justify-center p-3 sm:items-center sm:p-6"
        >
          <button
            type="button"
            aria-label={c.workClose}
            onClick={() => setActive(null)}
            className="absolute inset-0 bg-ink/45 backdrop-blur-[2px]"
          />

          <div className="relative z-10 max-h-[92dvh] w-full max-w-3xl overflow-y-auto border border-line bg-paper">
            <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-wash">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewFor(active ?? 0)}
                alt=""
                className="h-full w-full object-cover grayscale"
              />
              <button
                ref={closeRef}
                type="button"
                onClick={() => setActive(null)}
                className={`absolute end-3 top-3 inline-flex h-9 items-center rounded-full border border-line bg-paper px-4 font-mono text-[10px] text-ink transition-colors hover:bg-signal hover:text-signal-ink ${labelStyle(locale)} ${focusRing}`}
              >
                {c.workClose}
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <p
                className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}
              >
                {current.index} Â· {current.categoryLabel[locale]}
              </p>
              <h3
                className={`mt-2 font-display text-2xl font-semibold leading-tight sm:text-3xl ${latinTracking(locale, "tracking-[-0.02em]")}`}
              >
                {current.title[locale]}
              </h3>
              <p className="mt-3 max-w-lg text-sm leading-7 text-soft">
                {current.summary[locale]}
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {current.stack.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-line px-2 py-0.5 font-mono text-[10px] text-soft"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <a
                href={current.source}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-signal px-6 font-mono text-[10px] font-medium text-signal-ink transition-colors hover:bg-signal-hover ${labelStyle(locale)} ${focusRing}`}
              >
                {c.workSource}
                <ArrowUpRightIcon width={14} height={14} aria-hidden />
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


