import Link from "next/link";
import { copy } from "@/content/copy";
import type { Locale } from "@/lib/i18n";
import { readStats, type StatsRange, type StatsSnapshot } from "@/lib/stats";
import { displayTracking, focusRing, labelStyle, shell } from "@/lib/styles";

export function isRange(value: unknown): value is StatsRange {
  return (
    typeof value === "string" &&
    (["today", "week", "month", "all"] as readonly string[]).includes(value)
  );
}

/**
 * The private stats screen. Shared by the cookie-gated /[locale]/stats page and
 * the secret /[locale]/s/[slug] page; `basePath` keeps the range links on
 * whichever URL the visitor came in on.
 */
export async function StatsView({
  locale,
  range,
  basePath,
}: {
  locale: Locale;
  range: StatsRange;
  basePath: string;
}) {
  let stats: StatsSnapshot | null = null;
  try {
    stats = await readStats(range);
  } catch {
    stats = null;
  }

  const s = copy[locale].stats;
  const number = new Intl.NumberFormat(locale === "fa" ? "fa-IR" : "en-US");
  const stamp = new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tehran",
  });
  const percent = (part: number, whole: number) => {
    const value = whole ? Math.round((part / whole) * 100) : 0;
    return locale === "fa"
      ? `${number.format(value)}٪`
      : `${number.format(value)}%`;
  };
  const storageLabel =
    stats?.storage === "kv"
      ? s.storageKv
      : stats?.storage === "file"
        ? s.storageFile
        : s.storageNone;

  return (
    <div className={`${shell} py-16 sm:py-24`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}>
          {s.label}
        </p>
        <Link
          href={`/${locale}`}
          className={`rounded font-mono text-[10px] leading-4 text-soft transition-colors hover:text-ink ${labelStyle(locale)} ${focusRing}`}
        >
          {s.back}
        </Link>
      </div>

      <h1
        className={`mt-6 font-display text-display font-semibold leading-none ${locale === "en" ? "uppercase" : ""} ${displayTracking(locale)}`}
      >
        {s.title}
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-soft">{s.lead}</p>

      <nav aria-label={s.rangeLabel} className="mt-8 flex flex-wrap gap-2">
        {(["today", "week", "month", "all"] as StatsRange[]).map((item) => {
          const active = item === range;
          return (
            <Link
              key={item}
              href={`${basePath}?range=${item}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex h-9 items-center rounded-full border px-4 font-mono text-[10px] transition-colors ${labelStyle(locale)} ${
                active
                  ? "border-signal bg-signal text-signal-ink"
                  : "border-line text-soft hover:border-ink hover:text-ink"
              } ${focusRing}`}
            >
              {s.ranges[item]}
            </Link>
          );
        })}
      </nav>

      {!stats || stats.storage === "none" ? (
        <div className="mt-10 border border-line p-6 text-sm leading-7 text-soft">
          <p className="font-medium text-ink">{s.notConfiguredTitle}</p>
          <p className="mt-2">{s.notConfiguredBody}</p>
        </div>
      ) : (
        <>
          <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-y border-line py-6">
            <div className="flex items-end gap-3">
              <span className="font-display text-6xl font-semibold leading-none tabular-nums sm:text-7xl">
                {number.format(stats.total)}
              </span>
              <span
                className={`pb-1 font-mono text-[10px] text-soft ${labelStyle(locale)}`}
              >
                {s.total}
              </span>
            </div>
            <p
              className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}
            >
              {s.storage}: {storageLabel}
            </p>
          </div>

          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {stats.groups.map((group) => {
              const groupTotal = group.rows.reduce(
                (sum, row) => sum + row.count,
                0,
              );

              return (
                <section key={group.id}>
                  <h2
                    className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}
                  >
                    {s.groups[group.id]}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {group.rows.map((row) => {
                      const share = groupTotal
                        ? Math.round((row.count / groupTotal) * 100)
                        : 0;

                      return (
                        <li key={row.id}>
                          <div className="flex items-baseline justify-between gap-3 text-sm">
                            <span>{s.labels[row.id] ?? row.id}</span>
                            <span className="tabular-nums text-soft">
                              {number.format(row.count)}
                              <span className="ms-1 text-[10px]">
                                ({percent(row.count, groupTotal)})
                              </span>
                            </span>
                          </div>
                          <div className="mt-1.5 h-1 bg-line">
                            <div
                              className="h-full bg-ink"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              );
            })}
          </div>

          <section className="mt-14">
            <h2
              className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}
            >
              {s.visitsTitle}
            </h2>

            {stats.visits.length === 0 ? (
              <p className="mt-4 text-sm text-soft">{s.visitsEmpty}</p>
            ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[36rem] border-collapse text-start text-[12px]">
                  <thead>
                    <tr
                      className={`font-mono text-[10px] text-soft ${labelStyle(locale)}`}
                    >
                      <th className="border-b border-line py-2 text-start font-normal">
                        {s.colTime}
                      </th>
                      <th className="border-b border-line py-2 text-start font-normal">
                        {s.colDevice}
                      </th>
                      <th className="border-b border-line py-2 text-start font-normal">
                        {s.colSystem}
                      </th>
                      <th className="border-b border-line py-2 text-start font-normal">
                        {s.colBrowser}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.visits.map((visit, index) => (
                      <tr
                        key={`${visit.at}-${index}`}
                        className="border-b border-line/60"
                      >
                        <td className="whitespace-nowrap py-2 pe-4 tabular-nums text-soft">
                          {stamp.format(new Date(visit.at))}
                        </td>
                        <td className="whitespace-nowrap py-2 pe-4">
                          {visit.model || s.labels[visit.device] || visit.device}
                        </td>
                        <td className="whitespace-nowrap py-2 pe-4 text-soft">
                          {s.labels[visit.os] ?? visit.os}
                          {visit.osVersion ? ` ${visit.osVersion}` : ""}
                        </td>
                        <td className="whitespace-nowrap py-2 text-soft">
                          {s.labels[visit.browser] ?? visit.browser}
                          {visit.browserVersion
                            ? ` ${visit.browserVersion}`
                            : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
