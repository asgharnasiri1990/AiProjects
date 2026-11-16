"use client";

import { useEffect, useRef, useState } from "react";
import { faNum } from "@/lib/format";

type Props = {
  min: number;
  max: number;
  value: number;
  onCommit: (value: number) => void;
  snaps?: number[];
  size?: number;
};

const SWEEP = 270;

function priceToT(price: number, min: number, max: number) {
  if (max <= min) return 0;
  return Math.min(1, Math.max(0, Math.log(price / min) / Math.log(max / min)));
}

function tToPrice(t: number, min: number, max: number, snaps: number[]) {
  const raw = min * Math.pow(max / min, t);
  for (const snap of snaps) {
    if (snap < min || snap > max) continue;
    if (Math.abs(t - priceToT(snap, min, max)) < 0.022) return snap;
  }
  const step = raw < 5_000_000 ? 100_000 : raw < 20_000_000 ? 250_000 : 1_000_000;
  return Math.round(raw / step) * step;
}

export function PriceKnob({
  min,
  max,
  value,
  onCommit,
  snaps = [],
  size = 168,
}: Props) {
  const [preview, setPreview] = useState<number | null>(null);
  const dragging = useRef(false);
  const wheelTimer = useRef<number | null>(null);
  const knobRef = useRef<HTMLDivElement>(null);

  // latest values for the non-passive wheel listener
  const latest = useRef({ min, max, value, preview, snaps, onCommit });
  useEffect(() => {
    latest.current = { min, max, value, preview, snaps, onCommit };
  }, [min, max, value, preview, snaps, onCommit]);

  useEffect(() => {
    const element = knobRef.current;
    if (!element) return;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const state = latest.current;
      const base = state.preview ?? state.value;
      const nextT = Math.min(
        1,
        Math.max(0, priceToT(base, state.min, state.max) + (event.deltaY > 0 ? -0.03 : 0.03)),
      );
      const next = tToPrice(nextT, state.min, state.max, state.snaps);

      setPreview(next);
      if (wheelTimer.current) window.clearTimeout(wheelTimer.current);
      wheelTimer.current = window.setTimeout(() => {
        state.onCommit(next);
        setPreview(null);
      }, 260);
    };

    element.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", handleWheel);
      if (wheelTimer.current) window.clearTimeout(wheelTimer.current);
    };
  }, []);

  const shown = preview ?? value;
  const t = priceToT(shown, min, max);
  const angle = -135 + t * SWEEP;

  const commit = (next: number) => {
    onCommit(next);
    setPreview(null);
  };

  const fromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const rect = knobRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let deg =
      (Math.atan2(event.clientY - cy, event.clientX - cx) * 180) / Math.PI + 90;
    if (deg > 180) deg -= 360;
    const clamped = Math.max(-135, Math.min(135, deg));
    setPreview(tToPrice((clamped + 135) / SWEEP, min, max, snaps));
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    fromPointer(event);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging.current) fromPointer(event);
  };

  const handlePointerUp = () => {
    if (!dragging.current) return;
    dragging.current = false;
    if (preview !== null) commit(preview);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const current = preview ?? value;
    let next: number | null = null;

    if (event.key === "ArrowRight" || event.key === "ArrowUp")
      next = tToPrice(Math.min(1, priceToT(current, min, max) + 0.02), min, max, snaps);
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown")
      next = tToPrice(Math.max(0, priceToT(current, min, max) - 0.02), min, max, snaps);
    else if (event.key === "Home") next = min;
    else if (event.key === "End") next = max;

    if (next !== null) {
      event.preventDefault();
      setPreview(next);
      onCommit(next);
      window.setTimeout(() => setPreview(null), 0);
    }
  };

  return (
    <div>
      <div
        className="relative mx-auto touch-none select-none"
        style={{ width: size, height: size }}
        ref={knobRef}
      >
        <svg
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <g stroke="rgba(255,255,255,.5)" strokeWidth="2" strokeLinecap="round">
            {[-135, -90, -45, 0, 45, 90, 135].map((deg) => (
              <line
                key={deg}
                x1="100"
                y1="9"
                x2="100"
                y2="19"
                transform={`rotate(${deg} 100 100)`}
              />
            ))}
          </g>
        </svg>

        <div
          role="slider"
          tabIndex={0}
          aria-label="حداکثر قیمت"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={shown}
          aria-valuetext={`${faNum(shown)} تومان`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onKeyDown={handleKeyDown}
          className="absolute inset-0 cursor-grab rounded-full bg-[radial-gradient(circle_at_35%_30%,#1c3a6e,#102a54_45%,#0a1c3a_100%)] shadow-[inset_0_2px_6px_rgba(255,255,255,.25),inset_0_-8px_18px_rgba(0,0,0,.35),0_14px_26px_-16px_rgba(16,42,84,.8)] outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 active:cursor-grabbing"
        >
          <span
            className="absolute left-1/2 top-1/2 w-[3px] origin-bottom rounded-full bg-gradient-to-t from-white/30 to-white"
            style={{
              height: Math.round(size * 0.33),
              transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            }}
          />
          <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0a1730] shadow-[inset_0_1px_2px_rgba(255,255,255,.3)]" />
        </div>
      </div>

      <div className="mt-3 text-center">
        <span className="block text-[11px] text-muted">حداکثر قیمت</span>
        <b className="mt-0.5 block text-xl font-black tracking-tight text-ink-strong">
          {faNum(shown)}
          <span className="mr-1 text-[10.5px] font-normal text-muted">تومان</span>
        </b>
      </div>
      <div className="mt-1.5 flex justify-between text-[9.5px] text-muted">
        <span>{faNum(min)}</span>
        <span>{faNum(max)}</span>
      </div>
    </div>
  );
}
