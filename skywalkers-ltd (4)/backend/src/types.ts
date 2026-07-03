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

export interface CreateConsultationInput {
  name: string;
  contact: string;
  division: Division;
  message: string;
}

export interface ConsultationStore {
  list(filter?: { division?: Division; status?: ConsultationStatus }): Promise<Consultation[]>;
  create(input: CreateConsultationInput): Promise<Consultation>;
  updateStatus(id: string, status: ConsultationStatus): Promise<Consultation | null>;
  remove(id: string): Promise<boolean>;
  counts(): Promise<Record<ConsultationStatus, number>>;
}
