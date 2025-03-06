export interface PasswordVault {
  id: number;
  address: string;
  name: string;
  token: string;
  readonly: boolean;
  ssl: boolean;
  certificate: string | null;
}
