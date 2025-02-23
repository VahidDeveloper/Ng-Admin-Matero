/** ldap server object to this */
export interface LdapServerModel {
  id: number;
  address: string;
  name: string;
  port: number;
  baseDn: string;
  password: string;
  userDn: string;
  activeDirectory: boolean;
  tls: boolean;
  ignoreCert: boolean;
}
