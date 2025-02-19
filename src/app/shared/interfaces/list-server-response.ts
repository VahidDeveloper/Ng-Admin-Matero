/**
 * list-server response returned by server for those which have server-side pagination.
 */
export interface ListServerResponse<T = any> {
  /**
   * the list of items are put here.
   */
  results: T[];
  /**
   * The number of all items based on chosen filters.
   */
  filterCount: number;
  /**
   * The number of all items no matter what the filters are.
   */
  totalCount: number;
  /**
   * the server time. We haven't used this parameter in lists yet.
   */
  serverTime?: number;
}
