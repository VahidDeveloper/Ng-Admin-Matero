/**
 * a class for handling list ordering.
 * NOTE THAT it is brought from shared module.
 * These classes should be removed and put in a general library to be used in several places.
 */
export class ListOrder {
  /**
   * sorting order
   */
  order?: 'asc' | 'desc';
  /**
   * sort by specified field
   */
  orderBy?: string;

  constructor(order?: 'asc' | 'desc', orderBy?: string) {
    this.order = order;
    this.orderBy = orderBy;
  }

  /**
   * it would covert the ordering info understandable from UI to the one understandable by server.
   */
  getServerObject(): any {
    return {
      order: this.order,
      sortField: this.orderBy,
    };
  }
}
