export class ApiError extends Error {
  status: number;
  errors: { message: string; name?: string; data?: { errors?: { path: string; message: string }[] } }[];

  constructor(status: number, errors: ApiError["errors"]) {
    super(errors.map((e) => e.message).join("; ") || `Request failed (${status})`);
    this.status = status;
    this.errors = errors;
  }

  get fieldErrors(): Record<string, string> {
    const out: Record<string, string> = {};
    for (const e of this.errors) for (const f of e.data?.errors ?? []) out[f.path] = f.message;
    return out;
  }
}
