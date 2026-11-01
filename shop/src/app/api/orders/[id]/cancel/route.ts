import { type NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxy";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  return proxyToApi(req, `/me/orders/${id}/cancel`, "POST");
}
