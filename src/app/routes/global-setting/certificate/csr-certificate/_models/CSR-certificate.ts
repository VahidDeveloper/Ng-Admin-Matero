/**
 * a model to manage CSR certificate
 */
export interface CSRCertificate {
  commonName: string;
  completed: boolean;
  country: string;
  csr: string;
  emailAddress: string;
  locality: string;
  organization: string;
  organizationUnit: string;
  state: string;
}
