/**
 * for stored credential data from server
 */
export interface OrganizationalPassword {
  id: number;
  address: string;
  name: string;
  token: string;
  readonly: boolean;
  ssl: boolean;
  certificate: string | null;
}
