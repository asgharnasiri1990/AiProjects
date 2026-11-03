"use client";

import { useState, type FormEvent } from "react";
import { copy } from "@/content/copy";
import { profile } from "@/content/profile";
import type { Locale } from "@/lib/i18n";
import { buttonPrimary } from "@/lib/styles";
import { ArrowRightIcon } from "@/components/icons";

const fieldClasses =
  "mt-2 w-full rounded-xl border border-line bg-canvas px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20";

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
    <form onSubmit={handleSubmit} noValidate className="max-w-xl">
      <p className="text-sm font-medium">{c.formTitle}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className="block text-xs font-medium text-ink-soft">
          {c.formName}
          <input
            type="text"
            name="name"
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={fieldClasses}
          />
        </label>
        <label className="block text-xs font-medium text-ink-soft">
          {c.formEmail}
          <input
            type="email"
            name="email"
            autoComplete="email"
            dir="ltr"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={`${fieldClasses} text-start`}
          />
        </label>
      </div>

      <label className="mt-4 block text-xs font-medium text-ink-soft">
        {c.formMessage}
        <textarea
          name="message"
          rows={4}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          className={`${fieldClasses} resize-y`}
        />
      </label>

      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-3">
        <button type="submit" className={buttonPrimary}>
          {c.formSubmit}
          <ArrowRightIcon className="rtl:-scale-x-100" />
        </button>
        <p className="max-w-xs text-xs leading-6 text-ink-soft">{c.formNote}</p>
      </div>
    </form>
  );
}
