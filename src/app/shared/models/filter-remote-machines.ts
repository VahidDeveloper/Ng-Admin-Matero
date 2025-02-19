import { RemoteApplication } from '../interfaces/remote-application';
import { RemoteCategory } from '../interfaces/remote-category';

/**
 * remote machines filter class
 */
export class FilterRemoteMachines {
  /**
   * remotes operating systems
   */
  operatingSystems: string[] = [];
  /**
   * remotes protocols
   */
  protocols: string[] = [];
  /**
   * remotes applications
   */
  remoteApplications: RemoteApplication[] = [];
  /**
   * remotes categories
   */
  remoteCategories: RemoteCategory[] = [];
  /**
   * remotes ID
   */
  remoteId = '';
  /**
   * remotes IP
   */
  remoteIp = '';
  /**
   * host Ids
   */
  hostIds? = [];
  /**
   * ip Addresses
   */
  ipAddresses? = [];
  /**
   * filter remote-machines which are not in specified categories.
   */
  excludeCategories? = [];
  /**
   * to filter remote machines base on a user name
   */
  username?: string;
  /**
   * to filter remote machines base on a ldap server
   */
  ldapServer?: string;
  /**
   *
   * filter remote-machines which are not in specified roles.
   */
  excludeRoles? = [];
  /**
   * filter remote-machines which are in roles.
   */
  roles? = [];
  /**
   * it would covert the filter info understandable from UI to the one understandable by server.
   */
  getServerObject(): any {
    const newFilter: any = {};
    if (this.operatingSystems?.length !== 0) {
      newFilter.osTypes = this.operatingSystems;
    }
    if (this.protocols?.length !== 0) {
      newFilter.protocols = this.protocols;
    }
    if (this.remoteCategories?.length !== 0) {
      newFilter.categories = this.remoteCategories.map(c => c.id);
    }
    if (this.remoteApplications?.length !== 0) {
      newFilter.applicationsName = this.remoteApplications.map(a => a.applicationName);
    }
    if (this.remoteIp && this.remoteIp !== '') {
      newFilter.ipPattern = this.remoteIp;
    }
    if (this.remoteId && this.remoteId !== '') {
      newFilter.hostIds = [this.remoteId];
    }
    if (this.hostIds?.length) {
      newFilter.hostIds = this.hostIds;
    }
    if (this.ipAddresses?.length) {
      newFilter.ipAddresses = this.ipAddresses;
    }
    if (this.excludeCategories?.length) {
      newFilter.excludeCategories = this.excludeCategories;
    }
    if (this.username) {
      newFilter.username = this.username;
    }
    if (this.ldapServer) {
      newFilter.ldapServer = this.ldapServer;
    }
    if (this.excludeRoles?.length) {
      newFilter.excludeRoles = this.excludeRoles;
    }
    if (this.roles?.length) {
      newFilter.roles = this.roles;
    }
    return newFilter;
  }

  /**
   * it would clone the current instance appropriately.
   * after adding new fields, this method should be updated.
   */
  clone(): FilterRemoteMachines {
    const newFilter = new FilterRemoteMachines();
    newFilter.operatingSystems = this.operatingSystems?.slice();
    newFilter.protocols = this.protocols?.slice();
    newFilter.remoteApplications = this.remoteApplications?.slice();
    newFilter.remoteCategories = this.remoteCategories?.slice();
    newFilter.remoteId = this.remoteId;
    newFilter.remoteIp = this.remoteIp;
    newFilter.hostIds = this.hostIds?.slice();
    newFilter.ipAddresses = this.ipAddresses?.slice();
    newFilter.excludeCategories = this.excludeCategories?.slice();
    newFilter.username = this.username;
    newFilter.ldapServer = this.ldapServer;
    return newFilter;
  }
}
