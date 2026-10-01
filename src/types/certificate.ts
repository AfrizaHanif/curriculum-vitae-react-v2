import type { ApiResponse } from "./api";

export interface Certificate {
  id?: string;
  profile_id?: string;
  title: string;
  name?: string; // Legacy alias for title
  type: string;
  issuer?: string | null;
  issuer_logo?: string | null;
  logo?: string | null;
  issued_date?: string | null;
  issue_date?: string | null; // Legacy alias for issued_date
  expired_date?: string | null;
  credential_id?: string | null;
  credential_url?: string | null;
  description?: string | null;
  file?: string | null;
  is_featured?: boolean;
  deleted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CertificateApiResponse = ApiResponse<Certificate[]>;
export type CertificateDetailApiResponse = ApiResponse<Certificate>;
