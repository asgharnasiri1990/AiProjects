"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { signIn, useUser } from "@/lib/store";
import { toEnglishDigits } from "@/lib/format";
import { container, card, input, label, btnPrimary } from "@/lib/ui";

export function LoginView() {
  const params = useSearchParams();
  const router = useRouter();
  const user = useUser();
  const next = params.get("next") || "/account";

  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 3) return setError("نام را کامل وارد کنید.");
    const digits = toEnglishDigits(phone).replace(/\D/g, "");
    if (!/^09\d{9}$/.test(digits)) return setError("شمارهٔ موبایل باید ۱۱ رقم و با ۰۹ شروع شود.");
    signIn({ name: name.trim(), phone: digits });
    router.push(next);
  };

  return (
    <main className={`${container} py-8`}>
      <form onSubmit={submit} className={`${card} mx-auto max-w-md p-6`}>
        <h1 className="text-lg font-extrabold text-ink-strong">ورود / ثبت‌نام</h1>
        <p className="mt-1 text-[11px] leading-6 text-muted">
          این ورود نمایشی است: نه رمزی ارسال می‌شود و نه اطلاعاتی به سرور می‌رود.
          اطلاعات فقط در همین مرورگر ذخیره می‌شود.
        </p>

        <div className="mt-4 grid gap-3">
          <label className={label}>
            نام و نام خانوادگی
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={input}
              placeholder="مثلاً امیر پاکزاد"
            />
          </label>
          <label className={label}>
            شمارهٔ موبایل
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              inputMode="tel"
              dir="ltr"
              placeholder="09xxxxxxxxx"
              className={`${input} text-left`}
            />
          </label>
        </div>

        {error ? (
          <p className="mt-3 rounded-lg bg-brand-soft px-3 py-2 text-[11px] font-semibold text-brand">
            {error}
          </p>
        ) : null}

        <button type="submit" className={`${btnPrimary} mt-4 w-full`}>
          ورود به حساب
        </button>

        <p className="mt-3 text-center text-[10.5px] text-muted">
          با ادامه، قوانین فروشگاه و شرایط بازگشت را می‌پذیرید.
        </p>
      </form>
    </main>
  );
}
