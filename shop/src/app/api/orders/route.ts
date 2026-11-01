import { type NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  return proxyToApi(req, "/me/orders", "GET");
}

export async function POST(req: NextRequest) {
  return proxyToApi(req, "/me/orders", "POST", { body: true });
}
