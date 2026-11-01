import { type NextRequest } from "next/server";
import { proxyToApi } from "@/lib/proxy";

interface Params {
  params: Promise<{ productId: string }>;
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { productId } = await params;
  return proxyToApi(req, `/me/cart/items/${productId}`, "PATCH", { body: true });
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { productId } = await params;
  return proxyToApi(req, `/me/cart/items/${productId}`, "DELETE");
}
