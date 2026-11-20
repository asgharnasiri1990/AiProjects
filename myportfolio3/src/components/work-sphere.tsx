"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copy } from "@/content/copy";
import { work, type WorkItem } from "@/content/work";
import type { Locale } from "@/lib/i18n";
import { displayTracking, focusRing, labelStyle, latinTracking } from "@/lib/styles";
import { ArrowUpRightIcon } from "@/components/icons";
import { CircleLink } from "@/components/circle-link";

/** Rows of the globe, latitude in degrees, and columns at the equator. */
const ROW_FROM = -80;
const ROW_TO = 80;
const ROWS = 9;
const BASE_COLS = 18;
const ROW_STEP = (ROW_TO - ROW_FROM) / (ROWS - 1);

function linkFor(item: WorkItem) {
  return item.source ?? item.live ?? "";
}

function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value;
}

interface Tile {
  lat: number;
  lon: number;
  item: number;
}

export function WorkSphere({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const items = work;

  const stageRef = useRef<HTMLDivElement | null>(null);
  const worldRef = useRef<HTMLDivElement | null>(null);
  const tileRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const suppressClick = useRef(false);
  const activeRef = useRef<number | null>(null);

  const [active, setActive] = useState<number | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  /** Latitude/longitude slots; photos cycle through the project list. */
  const tiles = useMemo<Tile[]>(() => {
    const out: Tile[] = [];
    let n = 0;
    for (let row = 0; row < ROWS; row += 1) {
      const lat = ROW_FROM + row * ROW_STEP;
      const shrink = Math.max(0.25, Math.cos((lat * Math.PI) / 180));
      const cols = Math.max(3, Math.round(BASE_COLS * shrink));
      const step = 360 / cols;
      const offset = row % 2 ? step / 2 : 0;
      for (let col = 0; col < cols; col += 1) {
        out.push({
          lat,
          lon: col * step + offset,
          item: n % items.length,
        });
        n += 1;
      }
    }
    return out;
  }, [items.length]);

  useEffect(() => {
    const stage = stageRef.current;
    const world = worldRef.current;
    if (!stage || !world) return;

    const stageEl = stage;
    const worldEl = world;

    let R = 200;
    let frame = 0;
    let last = 0;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const state = {
      yaw: 0,
      pitch: -8,
      dragYaw: 0,
      dragPitch: 0,
      vX: 0,
      vY: 0,
      auto: 0,
      scrollYaw: 0,
      scale: 1,
    };

    function layout() {
      const width = stageEl.clientWidth;
      const height = stageEl.clientHeight;
      R = Math.max(140, Math.min(420, Math.min(height * 0.44, width * 0.3)));

      const arcH = R * ((ROW_STEP * Math.PI) / 180) * 0.9;

      tiles.forEach((tile, index) => {
        const el = tileRefs.current[index];
        if (!el) return;
        const shrink = Math.max(0.2, Math.cos((tile.lat * Math.PI) / 180));
        const cols = Math.max(3, Math.round(BASE_COLS * shrink));
        const arcW = ((2 * Math.PI * R) / cols) * shrink * 0.9;
        el.style.width = `${Math.round(arcW)}px`;
        el.style.height = `${Math.round(arcH)}px`;
        el.style.marginLeft = `${-Math.round(arcW) / 2}px`;
        el.style.marginTop = `${-Math.round(arcH) / 2}px`;
        el.style.transform = `rotateY(${tile.lon}deg) rotateX(${-tile.lat}deg) translateZ(${R}px)`;
      });
    }

    function tick(now: number) {
      const dt = last ? Math.min(48, now - last) : 16;
      last = now;

      if (!drag && activeRef.current === null) {
        if (!reduceMotion) state.auto += dt * 0.009;
        state.dragYaw += state.vX;
        state.dragPitch += state.vY;
        state.vX *= 0.94;
        state.vY *= 0.94;
        if (Math.abs(state.vX) < 0.002) state.vX = 0;
        if (Math.abs(state.vY) < 0.002) state.vY = 0;
        state.dragPitch = clamp(state.dragPitch, -38, 38);
      }

      // Section travel through the viewport: a slow extra turn.
      const rect = stageEl.getBoundingClientRect();
      const travel =
        (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      state.scrollYaw = clamp(travel, 0, 1) * 120;

      state.yaw = state.auto + state.scrollYaw + state.dragYaw;
      state.pitch = clamp(-8 + state.dragPitch, -55, 40);

      worldEl.style.transform =
        `rotateX(${state.pitch}deg) rotateY(${state.yaw}deg)`;

      frame = requestAnimationFrame(tick);
    }

    let drag: {
      id: number;
      lx: number;
      ly: number;
      moved: number;
    } | null = null;

    function onDown(event: PointerEvent) {
      if (activeRef.current !== null) return;
      drag = {
        id: event.pointerId,
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

      state.dragYaw += dx * 0.22;
      state.dragPitch += dy * 0.14;
      state.vX = dx * 0.22;
      state.vY = dy * 0.14;

      drag.moved = Math.max(drag.moved, Math.abs(dx) + Math.abs(dy));
      if (drag.moved > 6) suppressClick.current = true;
    }

    function onUp() {
      drag = null;
      window.setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    }

    // Wheel over the globe spins it; outside the globe (but in the section)
    // the page scrolls normally.
    function onWheel(event: WheelEvent) {
      if (activeRef.current !== null) return;
      const rect = stageEl.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (Math.hypot(event.clientX - cx, event.clientY - cy) > R * 1.15) return;
      event.preventDefault();
      const delta = event.deltaMode === 1 ? event.deltaY * 16 : event.deltaY;
      state.dragYaw += delta * 0.32;
      state.vX = clamp(state.vX + delta * 0.02, -6, 6);
    }

    layout();
    frame = requestAnimationFrame(tick);

    stageEl.addEventListener("pointerdown", onDown);
    stageEl.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);

    const onResize = () => layout();
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      stageEl.removeEventListener("pointerdown", onDown);
      stageEl.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("resize", onResize);
    };
  }, [tiles]);

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
    <div>
      <h2
        className={`text-center font-display text-display font-semibold leading-none ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
      >
        {c.workLabel}
      </h2>

      <div
        ref={stageRef}
        className="relative mx-auto mt-4 h-[clamp(400px,70vh,700px)] w-full touch-pan-y select-none sm:mt-8"
        style={{ perspective: "1400px", perspectiveOrigin: "50% 50%" }}
      >
        <div
          ref={worldRef}
          className="absolute left-1/2 top-1/2 h-0 w-0 [transform-style:preserve-3d]"
        >
          {tiles.map((tile, index) => {
            const item = items[tile.item];
            return (
              <button
                key={`${tile.lat}-${tile.lon}`}
                type="button"
                ref={(el) => {
                  tileRefs.current[index] = el;
                }}
                onClick={() => {
                  if (suppressClick.current) return;
                  setActive(tile.item);
                }}
                aria-label={`${item.title[locale]} — ${item.source ? c.workSource : c.workVisit}`}
                className={`absolute left-0 top-0 overflow-hidden rounded-[2px] border border-paper bg-wash [backface-visibility:hidden] ${focusRing}`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover object-top grayscale"
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        <span className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}>
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
                className="h-full w-full object-cover object-top grayscale"
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
              <p className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}>
                {current.index} · {current.categoryLabel[locale]}
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
                <p className={`mt-6 font-mono text-[10px] text-soft ${labelStyle(locale)}`}>
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
