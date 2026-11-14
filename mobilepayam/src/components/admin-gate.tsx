"use client";

import { useState } from "react";
import { ADMIN_DEMO_CODE, unlockAdmin } from "@/lib/store";
import { toEnglishDigits } from "@/lib/format";
import { container, card, input, btnPrimary } from "@/lib/ui";

export function AdminGate() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const normalized = toEnglishDigits(code).replace(/\D/g, "");
    if (!normalized) {
      setError("کد را وارد کنید.");
      return;
    }
    if (!unlockAdmin(normalized)) {
      setError("کد اشتباه است.");
      return;
    }
    setError("");
  };

  return (
    <main className={`${container} py-16`}>
      <form onSubmit={submit} className={`${card} mx-auto max-w-sm p-6`}>
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-brand-soft text-xl text-brand">
            🔒
          </span>
          <h1 className="mt-3 text-base font-extrabold text-ink-strong">
            ورود به پنل مدیریت
          </h1>
          <p className="mt-1 text-[11px] leading-6 text-muted">
            دسترسی به محصولات، سفارش‌ها و دسته‌بندی‌ها
          </p>
        </div>

        <label className="mt-4 flex flex-col gap-1.5 text-xs font-semibold text-muted">
          کد ورود
          <input
            type="password"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setError("");
            }}
            inputMode="numeric"
            dir="ltr"
            autoFocus
            placeholder="••••"
            className={`${input} text-center tracking-[0.4em]`}
          />
        </label>

        {error ? (
          <p className="mt-2 rounded-lg bg-brand-soft px-3 py-2 text-center text-[11px] font-semibold text-brand">
            {error}
          </p>
        ) : null}

        <button type="submit" className={`${btnPrimary} mt-3 w-full`}>
          ورود
        </button>

        <p className="mt-3 rounded-lg bg-canvas px-3 py-2 text-center text-[10.5px] leading-5 text-muted">
          کد نمونه:{" "}
          <b className="font-mono text-ink">
            {ADMIN_DEMO_CODE.replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)])}
          </b>
          <br />
          این قفل نمایشی است و امنیت واقعی ایجاد نمی‌کند.
        </p>
      </form>
    </main>
  );
}
