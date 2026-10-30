import { NextRequest, NextResponse } from "next/server";

export interface FlightData {
  flightNumber: string;
  airline: string;
  status: string;
  departure: {
    airport: string;
    iata: string;
    scheduled: string | null;
    estimated: string | null;
    actual: string | null;
    terminal: string | null;
    gate: string | null;
  };
  arrival: {
    airport: string;
    iata: string;
    scheduled: string | null;
    estimated: string | null;
    actual: string | null;
    terminal: string | null;
    gate: string | null;
  };
  duration: string | null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const flightNumber = searchParams.get("flight");

  if (!flightNumber) {
    return NextResponse.json(
      { error: "Flight number is required" },
      { status: 400 }
    );
  }

  const apiKey = process.env.AVIATIONSTACK_API_KEY;

  if (!apiKey || apiKey === "your_api_key_here") {
    // Return mock data when no API key is configured
    return NextResponse.json(getMockFlight(flightNumber.toUpperCase()));
  }

  try {
    const response = await fetch(
      `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber.toUpperCase()}&limit=1`,
      { next: { revalidate: 60 } }
    );

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();

    if (!data.data || data.data.length === 0) {
      return NextResponse.json(
        { error: `No flight found for "${flightNumber.toUpperCase()}"` },
        { status: 404 }
      );
    }

    const f = data.data[0];

    const dep = f.departure;
    const arr = f.arrival;

    // Compute duration if both scheduled times exist
    let duration: string | null = null;
    if (dep.scheduled && arr.scheduled) {
      const depTime = new Date(dep.scheduled);
      const arrTime = new Date(arr.scheduled);
      const diffMs = arrTime.getTime() - depTime.getTime();
      if (diffMs > 0) {
        const hours = Math.floor(diffMs / 3_600_000);
        const minutes = Math.floor((diffMs % 3_600_000) / 60_000);
        duration = `${hours}h ${minutes}m`;
      }
    }

    const result: FlightData = {
      flightNumber: f.flight?.iata ?? flightNumber.toUpperCase(),
      airline: f.airline?.name ?? "Unknown Airline",
      status: f.flight_status ?? "unknown",
      departure: {
        airport: dep.airport ?? "Unknown",
        iata: dep.iata ?? "",
        scheduled: dep.scheduled ?? null,
        estimated: dep.estimated ?? null,
        actual: dep.actual ?? null,
        terminal: dep.terminal ?? null,
        gate: dep.gate ?? null,
      },
      arrival: {
        airport: arr.airport ?? "Unknown",
        iata: arr.iata ?? "",
        scheduled: arr.scheduled ?? null,
        estimated: arr.estimated ?? null,
        actual: arr.actual ?? null,
        terminal: arr.terminal ?? null,
        gate: arr.gate ?? null,
      },
      duration,
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch flight data. Please try again." },
      { status: 500 }
    );
  }
}

// ---------------------------------------------------------------------------
// Mock data – used when AVIATIONSTACK_API_KEY is not configured
// ---------------------------------------------------------------------------
function getMockFlight(flightNumber: string): FlightData {
  const now = new Date();
  const dep = new Date(now.getTime() + 2 * 3_600_000); // 2 hours from now
  const arr = new Date(now.getTime() + 7 * 3_600_000); // 7 hours from now

  const mockFlights: Record<string, Partial<FlightData>> = {
    BA123: {
      airline: "British Airways",
      departure: {
        airport: "London Heathrow Airport",
        iata: "LHR",
        scheduled: dep.toISOString(),
        estimated: dep.toISOString(),
        actual: null,
        terminal: "5",
        gate: "B22",
      },
      arrival: {
        airport: "John F. Kennedy International Airport",
        iata: "JFK",
        scheduled: arr.toISOString(),
        estimated: arr.toISOString(),
        actual: null,
        terminal: "7",
        gate: "A14",
      },
    },
    AA100: {
      airline: "American Airlines",
      departure: {
        airport: "John F. Kennedy International Airport",
        iata: "JFK",
        scheduled: dep.toISOString(),
        estimated: dep.toISOString(),
        actual: null,
        terminal: "8",
        gate: "8C",
      },
      arrival: {
        airport: "London Heathrow Airport",
        iata: "LHR",
        scheduled: arr.toISOString(),
        estimated: arr.toISOString(),
        actual: null,
        terminal: "3",
        gate: "D47",
      },
    },
  };

  const mock = mockFlights[flightNumber] ?? {};
  const depTime = mock.departure?.scheduled
    ? new Date(mock.departure.scheduled)
    : dep;
  const arrTime = mock.arrival?.scheduled
    ? new Date(mock.arrival.scheduled)
    : arr;
  const diffMs = arrTime.getTime() - depTime.getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  const minutes = Math.floor((diffMs % 3_600_000) / 60_000);

  return {
    flightNumber,
    airline: mock.airline ?? "Demo Airlines",
    status: "scheduled",
    departure: mock.departure ?? {
      airport: "Origin Airport",
      iata: "ORG",
      scheduled: dep.toISOString(),
      estimated: dep.toISOString(),
      actual: null,
      terminal: "1",
      gate: "G1",
    },
    arrival: mock.arrival ?? {
      airport: "Destination Airport",
      iata: "DST",
      scheduled: arr.toISOString(),
      estimated: arr.toISOString(),
      actual: null,
      terminal: "2",
      gate: "G2",
    },
    duration: `${hours}h ${minutes}m`,
  };
}
