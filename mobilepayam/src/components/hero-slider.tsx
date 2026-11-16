"use client";

import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/images/hero/1.webp", alt: "پیشنهاد ویژهٔ نمایشگر و گوشی" },
  { src: "/images/hero/2.webp", alt: "پیشنهاد ویژهٔ موبایل" },
  { src: "/images/hero/3.webp", alt: "پیشنهاد ویژهٔ لوازم جانبی" },
  { src: "/images/hero/4.webp", alt: "پیشنهاد ویژهٔ ساعت هوشمند" },
  { src: "/images/hero/5.jpg", alt: "پاوربانک بودی با شارژ سریع" },
];

export function HeroSlider() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % SLIDES.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused]);

  const go = (direction: 1 | -1) =>
    setIndex((current) => (current + direction + SLIDES.length) % SLIDES.length);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0b0b12]"
      aria-roledescription="carousel"
      aria-label="پیشنهادهای ویژهٔ mobilepayam"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <h1 className="sr-only">
        mobilepayam — خرید موبایل، ساعت هوشمند و لوازم جانبی اصل
      </h1>

      <div className="relative h-[210px] w-full sm:h-[300px] md:h-[400px]">
        {SLIDES.map((slide, slideIndex) => (
          <div
            key={slide.src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              slideIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* blurred fill so the full-bleed box has no empty bars */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-xl"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.src}
              alt={slide.alt}
              loading="eager"
              className="relative z-10 h-full w-full object-contain"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="اسلاید قبلی"
        onClick={() => go(-1)}
        className="absolute right-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-lg text-white transition-colors hover:bg-black/55 sm:grid"
      >
        ›
      </button>
      <button
        type="button"
        aria-label="اسلاید بعدی"
        onClick={() => go(1)}
        className="absolute left-3 top-1/2 hidden h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-black/30 text-lg text-white transition-colors hover:bg-black/55 sm:grid"
      >
        ‹
      </button>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5">
        {SLIDES.map((slide, slideIndex) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`رفتن به اسلاید ${slideIndex + 1}`}
            aria-current={slideIndex === index}
            onClick={() => setIndex(slideIndex)}
            className={`h-2 rounded-full transition-all ${
              slideIndex === index ? "w-5 bg-white" : "w-2 bg-white/45 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
