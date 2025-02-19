/**
 * users info entity class
 */
import { Group } from './group';
import { OtpStatus } from '@shared/enums';

export interface UsersInfoEntity {
  /**
   * user's dn
   */
  dn: string;
  /**
   * user's username
   */
  username: string;
  /**
   * user's password
   */
  password: string;
  /**
   * user's password
   */
  repeatPassword: string;
  /**
   * users common name
   */
  commonName: string;

  /**
   * user's first name
   */
  firstName: string;

  /**
   * user's last name
   */
  lastName: string;

  /**
   * user's employee id
   */
  employeeId: number;

  /**
   * user's display name
   */
  displayName: string;

  /**
   * user's email address
   */
  email: string;

  /**
   * secondary user's email address
   */
  emailOther: string;

  /**
   * user's telephone number
   */
  telephone: string;

  /**
   * secondary user's telephone number
   */
  telephoneOther: string;

  /**
   * user's mobile number
   */
  mobile: string;

  /**
   * secondary user's mobile number
   */
  mobileOther: string;

  /**
   * user's home phone number
   */
  homePhone: string;

  /**
   * secondary user's home phone number
   */
  homePhoneOther: string;

  /**
   * user's fax number
   */
  fax: string;

  /**
   * secondary user's fax number
   */
  faxOther: string;

  /**
   * user's pager number
   */
  pager: string;

  /*
   * user's home address
   */
  homeAddress: string;

  /**
   * user's state name
   */
  state: string;

  /**
   * user's city name
   */
  city: string;

  /**
   * user's country name
   */
  country: string;

  /**
   * user's office address
   */
  officeAddress: string;

  /**
   * user's zip code
   */
  zipCode: string;

  /**
   * user's post box address
   */
  postbox: string;

  /**
   * user's web address
   */
  webAddress: string;

  /**
   * secondary user's web address
   */
  webAddressOther: string;

  /**
   * user's company name
   */
  company: string;

  /**
   * user's department name
   */
  department: string;

  /**
   * user's job title
   */
  jobTitle: string;

  /**
   * a brief description about user
   */
  description: string;

  /**
   * user's comment about her/his profile
   */
  comment: string;

  /**
   * user's initialis name
   */
  initials: string;

  /**
   * user's image in string format
   * we use base64 for encoding user image
   */
  image: string;
  /**
   * this attribute is used for remote admins
   */
  remoteAdmin: boolean;
  /**
   * hardware's thumbprint
   */
  certThumbprint: string;
  /**
   * hardware's token serial
   */
  tokenSerial: string;
  /**
   * user's opt state
   */
  otpState: OtpStatus;
  /**
   * user's lockdown state
   */
  lockState: 'LOCK' | 'UNLOCK' | 'LOCKED_BY_ADMIN';

  ldapServer?: string;

  groups: Group[];
}
