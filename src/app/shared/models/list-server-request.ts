import { ListOrder } from './list-order';

/**
 * all list have a common request style. the pagination , search and sorting are boxed here as a request type
 */
export class ListServerRequest extends ListOrder {
  /**
   * number of items(rows) in page
   */
  numberOfItemsPerPage = 10;
  /**
   * number for current page ( it starts from 1 )
   */
  pageNumber = 1;

  /**
   * simple search word for searching in all columns
   */
  queryWord: string | undefined;

  advancedFilter: any;

  /**
   * it would fill members based on given info.
   * All params are arbitrary so if you just call new Pagination(), default values would be used.
   */
  constructor(
    pageNumber?: number,
    numberOfItemsPerPage?: number,
    order?: 'asc' | 'desc',
    orderBy?: string
  ) {
    super(order, orderBy);
    if (pageNumber) {
      this.pageNumber = pageNumber;
    }
    if (numberOfItemsPerPage) {
      this.numberOfItemsPerPage = numberOfItemsPerPage;
    }
  }

  /**
   * it would covert the pagination info understandable from UI to the one understandable by server.
   */
  getServerObject(): any {
    return {
      ...(this.advancedFilter || null),
      ...super.getServerObject(),
      queryWord: this.queryWord,
      limit: this.numberOfItemsPerPage,
      // pageNumber starts from 1 but multiple starts from 0
      multiple: this.pageNumber > 0 ? this.pageNumber - 1 : 0,
    };
  }

  /**
   * it would return pagination's ordering information.
   */
  getListOrder(): ListOrder {
    return new ListOrder(this.order, this.orderBy);
  }
}
