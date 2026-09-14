import type { ApiResponse } from "./api";

export interface Certificate {
  id?: string;
  profile_id?: string;
  name: string;
  type: string;
  issuer: string;
  issue_date: string;
  credential_id?: string | null;
  credential_url?: string | null;
  description?: string | null;
  file: string;
}

export type CertificateApiResponse = ApiResponse<Certificate[]>;
