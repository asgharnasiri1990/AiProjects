import { type NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxy";

export async function POST(req: NextRequest) {
  return proxyToApi(req, "/me/cart/items", "POST", { body: true });
}
