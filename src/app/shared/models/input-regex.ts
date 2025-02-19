/**
 * this class is used to gather all regular expressions
 */
export class InputRegex {
  /**
   * a regular expression for url with Http or Https
   */
  static readonly url = new RegExp(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_.~#?&/=]*)/
  );
  /**
   * a regular expression for english characters numbers and special characters
   */
  static readonly onlyEnglishCharAndNumAndSpecialChar = new RegExp(
    /^[~`!@#.$%^&*()_+=[\]}|;':"<>?A-Za-z0-9-\s]+$/
  );

  /**
   * a regular expression for english characters and numbers
   */
  static readonly onlyEnglishCharAndNum = new RegExp(/^[A-Za-z0-9]*$/);
  /**
   * a regular expression for URI pattern
   */
  static readonly uriPattern = new RegExp(/\w+:(\/?\/?)\S+/);

  /**
   * a regular expression for mobile
   */
  static readonly phone = new RegExp(/^(98|0)?9\d{9}$/g);

  /**
   * a regular expression for password
   */
  static readonly password = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$_%^&*-]).{8,}$/
  );
  /**
   * a regular expression for phone
   */
  static readonly phoneNumber = new RegExp(/^(\+98|0)\d{9,10}$/);
  /**
   * a regular expression for IPv4 IP address
   */
  static readonly ipv4 = /^\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b$/;
  /**
   * a regular expression for phone number that can contain star(*) and zero not allowed at start
   */
  static readonly phoneNumberAndStars = /^(?!0)[0-9*]*$/;
  /**
   * a regular expression for ip or hostname.
   * it would validate 1.2.3.4 and mail.mahsan.co
   */
   
  static readonly ipVsHostname =
    /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$|^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)+([A-Za-z]|[A-Za-z][A-Za-z0-9]*[A-Za-z0-9])$/;
}
