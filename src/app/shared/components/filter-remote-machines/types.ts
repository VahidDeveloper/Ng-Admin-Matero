/**
 * fields which can be hidden
 */
export type FieldsToBeHiddenRemoteMachines =
  | 'operatingSystems'
  | 'protocols'
  | 'remoteApplications'
  | 'remoteCategories'
  | 'remoteId';

/**
 * this class is being used as an object which holds some flags, which are the fields of filter
 * it indicates whether they should be hidden or not
 */
export class HiddenFieldsFilterRemoteMachines {
  /**
   * hidden flags for 'operatingSystems' field
   */
  operatingSystems = false;
  /**
   * hidden flags for 'protocols' field
   */
  protocols = false;
  /**
   * hidden flags for 'remoteApplications' field
   */
  remoteApplications = false;
  /**
   * hidden flags for 'remoteCategories' field
   */
  remoteCategories = false;
  /**
   * hidden flags for 'remoteId' field
   */
  remoteId = false;
  /**
   * hidden flags for 'remoteIp' field
   */
  remoteIp = false;
}
