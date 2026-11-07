"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { metalButton, fieldStyle } from "@/lib/styles";
import { ArrowRightIcon } from "@/components/icons";

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

    setError("");
    const subject = `${c.formSubject} — ${name.trim()}`;
    const body = `${message.trim()}\n\n— ${name.trim()}\n${email.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <p className="text-sm font-medium">{c.formTitle}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-[11px] text-muted">
          {c.formName}
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldStyle}
          />
        </label>

        <label className="block text-[11px] text-muted">
          {c.formEmail}
          <input
            type="email"
            name="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${fieldStyle} text-start`}
          />
        </label>
      </div>

      <label className="mt-4 block text-[11px] text-muted">
        {c.formMessage}
        <textarea
          name="message"
          rows={5}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${fieldStyle} resize-y`}
        />
      </label>

      {error ? (
        <p role="alert" className="mt-3 text-xs text-accent">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <button type="submit" className={metalButton}>
          {c.formSubmit}
          <ArrowRightIcon className="rtl:-scale-x-100" />
        </button>
        <p className="max-w-xs text-[11px] leading-5 text-muted">{c.formNote}</p>
      </div>
    </form>
  );
}
