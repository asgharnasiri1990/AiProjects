"use client";

import { useState, useRef } from "react";
import type { FlightData } from "./api/flight/route";

// ---------------------------------------------------------------------------
// Status badge helpers
// ---------------------------------------------------------------------------
const STATUS_STYLES: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800",
  active: "bg-green-100 text-green-800",
  landed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
  incident: "bg-orange-100 text-orange-800",
  diverted: "bg-yellow-100 text-yellow-800",
  unknown: "bg-gray-100 text-gray-700",
};

function statusStyle(status: string) {
  return STATUS_STYLES[status] ?? STATUS_STYLES.unknown;
}

// ---------------------------------------------------------------------------
// Time formatter
// ---------------------------------------------------------------------------
function formatTime(iso: string | null, label: string) {
  if (!iso) return null;
  const d = new Date(iso);
  return {
    label,
    time: d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    date: d.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    full: d.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------
function TimeCard({
  title,
  airport,
  iata,
  scheduled,
  estimated,
  actual,
  terminal,
  gate,
}: {
  title: string;
  airport: string;
  iata: string;
  scheduled: string | null;
  estimated: string | null;
  actual: string | null;
  terminal: string | null;
  gate: string | null;
}) {
  const primary = formatTime(actual ?? estimated ?? scheduled, "");
  const sched = formatTime(scheduled, "Scheduled");
  const est = formatTime(estimated, "Estimated");
  const act = formatTime(actual, "Actual");

  const isDeparture = title === "Departure";

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">{isDeparture ? "✈️" : "🛬"}</span>
        <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">
          {title}
        </span>
      </div>

      {/* Airport */}
      <div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold text-gray-900 font-mono">
            {iata || "—"}
          </span>
          {primary && (
            <span className="text-2xl font-semibold text-gray-800 ml-2">
              {primary.time}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1 leading-snug">{airport}</p>
        {primary && (
          <p className="text-xs text-gray-400 mt-0.5">{primary.date}</p>
        )}
      </div>

      {/* Time breakdown */}
      <div className="space-y-1 text-sm border-t border-gray-50 pt-3">
        {[sched, est, act].map(
          (t) =>
            t && (
              <div key={t.label} className="flex justify-between">
                <span className="text-gray-400">{t.label}</span>
                <span className="font-mono text-gray-700">
                  {t.time}{" "}
                  <span className="text-gray-400 text-xs">{t.date}</span>
                </span>
              </div>
            )
        )}
      </div>

      {/* Terminal / Gate */}
      {(terminal || gate) && (
        <div className="flex gap-4 text-sm border-t border-gray-50 pt-3">
          {terminal && (
            <div>
              <span className="text-gray-400 block text-xs uppercase tracking-wide">
                Terminal
              </span>
              <span className="font-semibold text-gray-800">{terminal}</span>
            </div>
          )}
          {gate && (
            <div>
              <span className="text-gray-400 block text-xs uppercase tracking-wide">
                Gate
              </span>
              <span className="font-semibold text-gray-800">{gate}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function FlightCard({ data }: { data: FlightData }) {
  return (
    <div className="space-y-4">
      {/* Flight header */}
      <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-2xl p-6 text-white flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sky-200 text-xs uppercase tracking-widest mb-1">
            Flight
          </p>
          <h2 className="text-3xl font-bold font-mono tracking-wide">
            {data.flightNumber}
          </h2>
          <p className="text-sky-100 mt-1">{data.airline}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusStyle(data.status)}`}
          >
            {data.status}
          </span>
          {data.duration && (
            <span className="text-sky-100 text-sm flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {data.duration}
            </span>
          )}
        </div>
      </div>

      {/* Flight path indicator */}
      <div className="flex items-center gap-3 px-2">
        <span className="font-mono font-bold text-xl text-gray-700">
          {data.departure.iata}
        </span>
        <div className="flex-1 flex items-center gap-1">
          <div className="h-px flex-1 bg-gray-300" />
          <span className="text-gray-400 text-lg">✈</span>
          <div className="h-px flex-1 bg-gray-300" />
        </div>
        <span className="font-mono font-bold text-xl text-gray-700">
          {data.arrival.iata}
        </span>
      </div>

      {/* Time cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TimeCard
          title="Departure"
          airport={data.departure.airport}
          iata={data.departure.iata}
          scheduled={data.departure.scheduled}
          estimated={data.departure.estimated}
          actual={data.departure.actual}
          terminal={data.departure.terminal}
          gate={data.departure.gate}
        />
        <TimeCard
          title="Arrival"
          airport={data.arrival.airport}
          iata={data.arrival.iata}
          scheduled={data.arrival.scheduled}
          estimated={data.arrival.estimated}
          actual={data.arrival.actual}
          terminal={data.arrival.terminal}
          gate={data.arrival.gate}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function Home() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flight, setFlight] = useState<FlightData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const examples = ["BA123", "AA100", "LH400", "DL001", "UA123"];

  async function lookup(flightNumber: string) {
    const q = flightNumber.trim().toUpperCase();
    if (!q) return;
    setQuery(q);
    setLoading(true);
    setError(null);
    setFlight(null);

    try {
      const res = await fetch(`/api/flight?flight=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        setFlight(data as FlightData);
      }
    } catch {
      setError("Network error – please check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    lookup(query);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 flex flex-col items-center px-4 py-12 gap-8">
      {/* Hero */}
      <div className="text-center space-y-2 max-w-lg">
        <div className="text-5xl mb-3">✈️</div>
        <h1 className="text-4xl font-bold text-gray-900">FlightTrack</h1>
        <p className="text-gray-500 text-lg">
          Enter a flight number to see departure &amp; arrival times instantly.
        </p>
      </div>

      {/* Search */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl flex gap-3 items-center"
      >
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value.toUpperCase())}
          placeholder="e.g. BA123 or AA100"
          className="flex-1 rounded-xl border border-gray-200 bg-white shadow-sm px-5 py-4 text-lg font-mono tracking-widest text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
          autoFocus
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={loading || !query.trim()}
          className="bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-semibold rounded-xl px-6 py-4 text-base shadow-sm transition cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Looking up…
            </span>
          ) : (
            "Search"
          )}
        </button>
      </form>

      {/* Quick examples */}
      <div className="flex flex-wrap gap-2 justify-center">
        <span className="text-gray-400 text-sm self-center">Try:</span>
        {examples.map((ex) => (
          <button
            key={ex}
            onClick={() => lookup(ex)}
            className="bg-white border border-gray-200 hover:border-sky-400 text-gray-600 hover:text-sky-700 font-mono text-sm px-3 py-1 rounded-lg shadow-sm transition cursor-pointer"
          >
            {ex}
          </button>
        ))}
      </div>

      {/* Results area */}
      <div className="w-full max-w-3xl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-5 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold">Flight not found</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {flight && <FlightCard data={flight} />}

        {!loading && !flight && !error && (
          <div className="text-center text-gray-300 text-6xl mt-8 select-none">
            🌍
          </div>
        )}
      </div>

      {/* Footer note */}
      <p className="text-xs text-gray-400 text-center max-w-sm">
        Powered by{" "}
        <a
          href="https://aviationstack.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
        >
          AviationStack
        </a>
        . Add your free API key to{" "}
        <code className="bg-gray-100 px-1 rounded">.env.local</code> to get
        live data.
      </p>
    </main>
  );
}
