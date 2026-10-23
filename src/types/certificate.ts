import type { ApiResponse, LocalizedString } from "./api";

export interface Certificate {
  id?: string;
  profile_id?: string;
  title: string;
  type: string;
  type_label?: string;
  type_labels: LocalizedString;
  issuer?: string | null;

  /**
   * Optional custom logo URL/path override.
   * Note: Not currently provided by the Laravel API; logos are dynamically
   * resolved on the client via cert-utils.tsx based on `issuer`.
   */
  issuer_logo?: string | null;

  issued_date?: string | null;
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
