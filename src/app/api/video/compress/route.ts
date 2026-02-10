import { proxyFormData } from "@/lib/proxy";

export async function POST(request: Request) {
  return proxyFormData("/api/video/compress", request);
}
