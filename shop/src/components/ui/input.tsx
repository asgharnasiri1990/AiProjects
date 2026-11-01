import { useId, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

const controlClasses =
  "w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-zinc-900 shadow-sm transition-colors placeholder:text-zinc-400 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500";

function stateClasses(error?: string | null) {
  return error
    ? "border-red-400 focus:border-red-500 focus:ring-red-500/30 dark:border-red-500"
    : "border-zinc-300 focus:border-primary-600 focus:ring-primary-600/20 dark:border-zinc-700 dark:focus:border-primary-300";
}

interface FieldProps {
  label: string;
  error?: string | null;
  hint?: string | null;
}

export function Input({
  label,
  error,
  hint,
  className = "",
  id,
  ...rest
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`${controlClasses} ${stateClasses(error)} ${className}`}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}

export function Textarea({
  label,
  error,
  hint,
  className = "",
  id,
  ...rest
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  return (
    <div className="space-y-1.5">
      <label htmlFor={inputId} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <textarea
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
        className={`${controlClasses} min-h-24 resize-y ${stateClasses(error)} ${className}`}
        {...rest}
      />
      {hint && !error && (
        <p id={hintId} className="text-xs text-zinc-500 dark:text-zinc-400">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
