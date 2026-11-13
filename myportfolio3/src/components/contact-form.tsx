"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { focusRing, labelStyle } from "@/lib/styles";
import { ArrowRightIcon } from "@/components/icons";

const FIELD =
  "mt-2 w-full border-0 border-b border-band-ink/25 bg-transparent px-0 py-2 text-sm text-band-ink transition-colors placeholder:text-band-ink/30 focus:border-signal focus:outline-none focus:ring-0";

export function ContactForm({ locale }: { locale: Locale }) {
  const c = copy[locale];
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError(c.formError);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(c.formEmailError);
      return;
    }

    setError("");
    const subject = `${c.formSubject} — ${name.trim()}`;
    const body = `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-2xl">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span
            className={`font-mono text-[11px] text-band-ink/50 sm:text-[10px] ${labelStyle(locale)}`}
          >
            {c.formName}
          </span>
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={FIELD}
          />
        </label>

        <label className="block">
          <span
            className={`font-mono text-[11px] text-band-ink/50 sm:text-[10px] ${labelStyle(locale)}`}
          >
            {c.formEmail}
          </span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${FIELD} text-start`}
          />
        </label>
      </div>

      <label className="mt-6 block">
        <span
          className={`font-mono text-[11px] text-band-ink/50 sm:text-[10px] ${labelStyle(locale)}`}
        >
          {c.formMessage}
        </span>
        <textarea
          name="message"
          rows={3}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${FIELD} resize-y`}
        />
      </label>

      {error ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 text-[13px] leading-6 text-band-ink sm:text-sm"
        >
          <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-signal" />
          {error}
        </p>
      ) : null}

      <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-4">
        <button
          type="submit"
          className={`inline-flex h-11 items-center gap-2 rounded-full bg-signal px-6 font-mono text-[11px] font-medium text-signal-ink transition-colors hover:bg-signal-hover sm:text-[10px] ${labelStyle(locale)} ${focusRing}`}
        >
          {c.formSubmit}
          <ArrowRightIcon
            width={14}
            height={14}
            className="rtl:-scale-x-100"
            aria-hidden
          />
        </button>
      </div>
    </form>
  );
}
