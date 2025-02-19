/**
 * the format of Wina REST's response when an error has occurred.
 */
export interface WinaRestApiErrorBody {
  /**
   * The encountered errors.
   * NOTE that in all Wina, errors almost always contain 1 item.
   * However, sometimes in warning mode, errors might contain than 1 item but in this case, this class is not used yet.
   */
  errors: { error: { code: number; description: string }; errorParams: string }[];
  /**
   * mostly it is null. It is said that in rare cases, it might have some extra information.
   */
  object: any;
  /**
   * mostly it is ERROR. In rare cases, it might have other values.
   */
  status: string;
}
