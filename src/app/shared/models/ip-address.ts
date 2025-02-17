/**
 * A model for ip-address
 */
export class IpAddress {
  constructor(ip?: string) {
    this.ipAddress = ip;
  }

  /**
   * related id
   */
  id?: number;
  /**
   * remote machine id
   */
  hostId?: number;
  /**
   * related ip-address
   */
  ipAddress?: string;
  /**
   * every remote machine has a primary address
   * by enabling this flag, the primary ip is shown
   */
  primary = false;
  /**
   * if the selected ip address has a connection config associated with
   */
  hasConnections = false;
}

export class IpAddressInput extends IpAddress {
  constructor(ip?: string) {
    super(ip);
  }

  /**
   * these item are temporary and will be removed soon
   *
   */
  editMode = false;
  invalid = false;
  duplicated = false;
}
