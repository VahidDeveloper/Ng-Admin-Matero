/**
 * a class for handling pagination option.
 * These classes should be removed and put in a general library to be used in several places.
 */
export class RowCount {
  /**
   * The total count of all rows.
   * Default value: `undefined`
   * just for showing not used in calculation
   */
  totalResultCount = 0;
  /**
   * after filtering data by some query the result count is stored here
   * this number is used for pagination calculation
   * when no filter applied it is equal to totalResultCount
   */
  totalFilteredResultCount = 0;

  constructor(totalFilteredResultCount?: number, totalResultCount?: number) {
    this.totalResultCount = totalResultCount ?? totalFilteredResultCount ?? 0;
    this.totalFilteredResultCount = totalFilteredResultCount ?? 0;
  }
}
