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

export interface JwtPayload {
  sub: "admin";
  iat?: number;
  exp?: number;
}
