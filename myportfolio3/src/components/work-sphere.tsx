"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copy } from "@/content/copy";
import { work, type WorkItem } from "@/content/work";
import type { Locale } from "@/lib/i18n";
import { displayTracking, focusRing, labelStyle, latinTracking } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";
import { CircleLink } from "@/components/circle-link";

/** Real screenshots, captured from the running sites (see content/work.ts). */
function linkFor(item: WorkItem) {
  return item.source ?? item.live ?? "";
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
    const stageEl = stage;

    let R = 200;
    let radius = 200;
    let perspective = 1000;
    let frame = 0;
    let last = 0;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const state = {
      dx: 0,
      dy: 0,
      vx: 0,
      vy: 0,
      tilt: -4,
      auto: 0,
      scrollYaw: 0,
    };
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
        160,
        Math.min(560, Math.min(height * 0.42, width * 0.46)),
      );
      R = radius;

      const scale = width <= 640 ? 0.6 : 0.58;
      const cw = Math.round(Math.max(96, radius * scale));
      perspective = width <= 640 ? 960 : 1500;

      stage.style.setProperty("--cw", `${cw}px`);
      stage.style.setProperty("--persp", `${perspective}px`);
      stage.style.setProperty(
        "--hw",
        `${Math.round(Math.min(width * 0.76, 460))}px`,
      );

      vecs.forEach((v, index) => {
        const el = cardRefs.current[index];
        if (!el) return;
        el.style.transform = `translate3d(${v.x * R}px, ${-v.y * R}px, ${v.z * R}px)`;
      });
    }

    function clampPitch() {
      state.dy = clamp(state.dy, -32 - state.tilt, 32 - state.tilt);
    }

    function tick(now: number) {
      const dt = last ? Math.min(48, now - last) : 16;
      last = now;

      if (!drag && activeRef.current === null) {
        if (!reduceMotion) state.auto += dt * 0.012;
        state.dx += state.vx;
        state.dy += state.vy;
        state.vx *= 0.94;
        state.vy *= 0.94;
        if (Math.abs(state.vx) < 0.002) state.vx = 0;
        if (Math.abs(state.vy) < 0.002) state.vy = 0;
        clampPitch();
      }

      // The section's travel through the viewport drives an extra yaw.
      const rect = stageEl.getBoundingClientRect();
      const travel =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      const progress = clamp(travel, 0, 1);
      state.scrollYaw = progress * 150;

      const sy = state.auto + state.scrollYaw + state.dx;
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

        // Counter-rotate the world so every card keeps facing the camera; a
        // slice of its tangent angle survives as depth variety. Without this
        // the far half turns edge-on and the sphere reads as a hemisphere.
        const tilt = 0.18;
        el.style.transform =
          `translate3d(${v.x * R}px, ${-v.y * R}px, ${v.z * R}px) ` +
          `rotateX(${-sx}deg) rotateY(${-sy}deg) ` +
          `rotateY(${v.lon * tilt}deg) rotateX(${v.lat * tilt}deg)`;

        const base = 0.12 + 0.88 * Math.pow((z2 + 1) / 2, 0.9);
        const opacity = (0.35 + 0.65 * base).toFixed(3);

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

      state.dx += dx * 0.16;
      state.dy += dy * 0.12;
      state.vx = dx * 0.16;
      state.vy = dy * 0.12;
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

    // Scrolling with the pointer over the sphere spins it faster instead of
    // scrolling the page. Outside the sphere the page scrolls as usual.
    function onWheel(event: WheelEvent) {
      if (activeRef.current !== null) return;
      const rect = stageEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - cx, event.clientY - cy);
      if (distance > R * 1.2) return;
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      state.dx += delta * 0.35;
      state.vx = clamp(state.vx + delta * 0.02, -6, 6);
    }

    layout();
    frame = requestAnimationFrame(tick);

    stage.addEventListener("pointerdown", onDown);
    stage.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      stage.removeEventListener("pointerdown", onDown);
      stage.removeEventListener("wheel", onWheel);
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
        className="relative mx-auto h-[clamp(420px,74vh,720px)] w-full touch-pan-y select-none"
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
              aria-label={`${item.title[locale]} — ${item.source ? c.workSource : c.workVisit}`}
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
                  src={item.image}
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
            className={`max-w-[70%] bg-paper px-[0.85em] py-[0.32em] text-center font-display text-[clamp(1.45rem,4vw,2.6rem)] font-semibold leading-none text-ink ring-1 ring-line ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
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
          label={`${c.workRepos} — ${c.externalLink}`}
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
                src={current.image}
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
              {linkFor(current) ? (
                <a
                  href={linkFor(current)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-signal px-6 font-mono text-[10px] font-medium text-signal-ink transition-colors hover:bg-signal-hover ${labelStyle(locale)} ${focusRing}`}
                >
                  {current.source ? c.workSource : c.workVisit}
                  <ArrowUpRightIcon width={14} height={14} aria-hidden />
                </a>
              ) : (
                <p
                  className={`mt-6 font-mono text-[10px] text-soft ${labelStyle(locale)}`}
                >
                  {current.categoryLabel[locale]}
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}


