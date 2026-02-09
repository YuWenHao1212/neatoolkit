const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://neatoolkit-api.livelystone-ee11a8ed.japaneast.azurecontainerapps.io"
    : "http://localhost:8000");

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface FetchApiOptions {
  timeout?: number;
  signal?: AbortSignal;
}

export async function fetchApi(
  path: string,
  body: FormData,
  options: FetchApiOptions = {},
): Promise<Response> {
  const { timeout = 120000, signal } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  const combinedSignal = signal
    ? AbortSignal.any([signal, controller.signal])
    : controller.signal;

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method: "POST",
      body,
      signal: combinedSignal,
    });

    clearTimeout(timeoutId);

    if (response.status === 503) {
      throw new ApiError("SERVER_WARMING_UP", 503);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message = errorData?.detail || `Request failed (${response.status})`;
      throw new ApiError(message, response.status);
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof ApiError) throw error;

    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("SERVER_WARMING_UP", 408);
    }

    throw new ApiError("Network error. Please check your connection.", 0);
  }
}
