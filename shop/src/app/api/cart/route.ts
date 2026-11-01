import { type NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxy";

export async function GET(req: NextRequest) {
  return proxyToApi(req, "/me/cart", "GET");
}

export async function DELETE(req: NextRequest) {
  return proxyToApi(req, "/me/cart", "DELETE");
}
