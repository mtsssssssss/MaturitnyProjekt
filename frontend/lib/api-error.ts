import type { AxiosError } from "axios";

export type BackendErrorResponse = {
  message: string;
  statusCode: number;
  traceId?: string;
  errors?: Record<string, string[]>;
};

export function getApiErrorMessage(err: unknown): string {
  const parsed = parseBackendError(err);
  if (!parsed) return "Neočakávaná chyba. Skúste to znova.";
  const parts: string[] = [parsed.message];
  if (parsed.errors) {
    const flat = Object.values(parsed.errors).flat();
    if (flat.length) parts.push(flat.join(" "));
  }
  return parts.join(" ");
}

export function parseBackendError(err: unknown): BackendErrorResponse | null {
  const e = err as AxiosError<BackendErrorResponse>;
  const d = e.response?.data;
  if (!d || typeof d !== "object" || !("message" in d)) return null;
  return {
    message: String(d.message),
    statusCode: Number(d.statusCode) || 0,
    traceId: d.traceId,
    errors: d.errors,
  };
}
