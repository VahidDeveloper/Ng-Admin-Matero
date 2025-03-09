/** syslog server object to this */
export interface SyslogServerModel {
  id: number;
  acceptCert: boolean;
  certificate: any;
  ignoreCert: boolean;
  address: string;
  port: number;
  protocol: string;
  ssl: boolean;
  subCategories: string[];
  syslogRfc: string;
}
