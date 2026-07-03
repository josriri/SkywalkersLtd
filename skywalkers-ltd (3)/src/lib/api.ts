export type Division = "digitizebiz" | "citizenease";
export type ConsultationStatus = "new" | "contacted" | "in_progress" | "closed";

export interface Consultation {
  id: string;
  name: string;
  contact: string;
  division: Division;
  message: string;
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
}

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (typeof body?.error === "string") message = body.error;
    } catch {
      // Response wasn't JSON — keep the generic message.
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  submitConsultation(input: { name: string; contact: string; division: Division; message: string }) {
    return request<{ ok: true; id: string }>("/api/consultations", {
      method: "POST",
      body: JSON.stringify({ ...input, website: "" }), // honeypot field, always empty from real users
    });
  },

  login(password: string) {
    return request<{ token: string; expiresIn: string }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
  },

  listConsultations(token: string, filter?: { division?: Division; status?: ConsultationStatus }) {
    const params = new URLSearchParams();
    if (filter?.division) params.set("division", filter.division);
    if (filter?.status) params.set("status", filter.status);
    const qs = params.toString();
    return request<{ items: Consultation[]; counts: Record<ConsultationStatus, number> }>(
      `/api/consultations${qs ? `?${qs}` : ""}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },

  updateStatus(token: string, id: string, status: ConsultationStatus) {
    return request<{ item: Consultation }>(`/api/consultations/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
  },

  deleteConsultation(token: string, id: string) {
    return request<void>(`/api/consultations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export { ApiError };
