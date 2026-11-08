import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { readStats } from "@/lib/stats";
import { focusRing, shell } from "@/lib/styles";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stats",
  robots: { index: false, follow: false },
};

export default async function StatsPage({
  params,
  searchParams,
}: PageProps<"/[locale]/stats">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const query = await searchParams;
  const token = typeof query.token === "string" ? query.token : undefined;
  if (!process.env.STATS_TOKEN || token !== process.env.STATS_TOKEN) {
    notFound();
  }

  let stats = null;
  try {
    stats = await readStats();
  } catch {
    stats = null;
  }

  return (
    <div className={`${shell} py-16 sm:py-24`}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
          Private
        </p>
        <Link
          href={`/${locale}`}
          className={`rounded font-mono text-[10px] uppercase tracking-[0.14em] text-soft transition-colors hover:text-ink ${focusRing}`}
        >
          Back to portfolio
        </Link>
      </div>

      <h1 className="mt-6 font-display text-display font-semibold uppercase leading-none">
        Visitor stats
      </h1>
      <p className="mt-4 max-w-xl text-sm leading-7 text-soft">
        Aggregate counts only. No IP addresses, raw user agents or cookies are
        stored.
      </p>

      {!stats || stats.storage === "none" ? (
        <div className="mt-10 border border-line p-6 text-sm leading-7 text-soft">
          <p className="font-medium text-ink">Storage is not configured.</p>
          <p className="mt-2">
            On Vercel, connect an Upstash Redis store and set{" "}
            <code className="rounded bg-wash px-1.5 py-0.5 font-mono text-[11px]">
              STATS_TOKEN
            </code>
            . Locally, counts are written to{" "}
            <code className="rounded bg-wash px-1.5 py-0.5 font-mono text-[11px]">
              .data/stats.json
            </code>
            .
          </p>
        </div>
      ) : (
        <>
          <div className="mt-10 flex items-end gap-3 border-y border-line py-6">
            <span className="font-display text-6xl font-semibold leading-none tabular-nums sm:text-7xl">
              {stats.total}
            </span>
            <span className="pb-1 font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
              total visits
            </span>
          </div>

          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {stats.groups.map((group) => {
              const groupTotal = group.rows.reduce(
                (sum, row) => sum + row.count,
                0,
              );

              return (
                <section key={group.id}>
                  <h2 className="font-mono text-[10px] uppercase tracking-[0.16em] text-soft">
                    {group.title}
                  </h2>
                  <ul className="mt-4 space-y-3">
                    {group.rows.map((row) => {
                      const percent = groupTotal
                        ? Math.round((row.count / groupTotal) * 100)
                        : 0;

                      return (
                        <li key={row.label}>
                          <div className="flex items-baseline justify-between gap-3 text-sm">
                            <span>{row.label}</span>
                            <span className="tabular-nums text-soft">
                              {row.count}
                              <span className="ms-1 text-[10px] text-faint">
                                ({percent}%)
                              </span>
                            </span>
                          </div>
                          <div className="mt-1.5 h-1 bg-line">
                            <div
                              className="h-full bg-ink"
                              style={{ width: `${percent}%` }}
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

          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.14em] text-soft">
            Storage: {stats.storage === "kv" ? "Vercel KV" : "local file"}
          </p>
        </>
      )}
    </div>
  );
}
