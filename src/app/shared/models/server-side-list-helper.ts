import { BehaviorSubject, Observable } from 'rxjs';
import { SortInfo } from './sort-info';
import { ListServerRequest } from './list-server-request';

export class ServerSideListHelper {
  /**
   * exposed observable for other to subscribe on change on list request
   * _listServerRequest should not be changed from outside, which is why we make the output readonly.
   */
  updateList: Observable<Readonly<ListServerRequest>>;

  /**
   * in grid-list, we need to know numberOfItemsPerPage.
   */
  get numberOfItemsPerPage(): number {
    return this._listServerRequest?.numberOfItemsPerPage;
  }

  /**
   * it would return list-server request.
   * _listServerRequest should not be changed from outside, which is why we make the output readonly.
   */
  get listServerRequest(): Readonly<ListServerRequest> {
    return this._listServerRequest;
  }

  /**
   * through this subject list update will be announced
   */
  private _updateListSubject: BehaviorSubject<ListServerRequest>;
  /**
   * keep server request state
   */
  private readonly _listServerRequest: ListServerRequest;

  constructor(listServerRequest?: ListServerRequest) {
    this._listServerRequest = listServerRequest ?? new ListServerRequest();
    this._updateListSubject = new BehaviorSubject<ListServerRequest>(this.listServerRequest);
    this.updateList = this._updateListSubject.asObservable();
  }

  /**
   * every time selected page or selected page size changed this method should be called
   * it use for material pagination
   */
  onPageEventChange(pageNumber: number, pageSize: number) {
    this._listServerRequest.pageNumber = pageNumber;
    if (this._listServerRequest.numberOfItemsPerPage !== pageSize || pageNumber === 0) {
      this._listServerRequest.pageNumber = 1;
    }
    this._listServerRequest.numberOfItemsPerPage = pageSize;
    this._updateListSubject.next(this.listServerRequest);
  }

  /**
   * every time selected page changed this method should be called
   */
  onPageChange(pageNumber: number) {
    this._listServerRequest.pageNumber = pageNumber;
    this._updateListSubject.next(this.listServerRequest);
  }

  /**
   * every time selected number of rows for table changed this method should be called
   */
  onNumberOfItemsPerPageChange(pageSize: number) {
    this._listServerRequest.numberOfItemsPerPage = pageSize;
    this._listServerRequest.pageNumber = 1;
    this._updateListSubject.next(this.listServerRequest);
  }

  /**
   * every time sort changed this method should be called
   * @param sort column and sort direction
   */
  onSortChange(sort: SortInfo) {
    this._listServerRequest.order = sort.dir;
    this._listServerRequest.orderBy = sort.prop;
    this._listServerRequest.pageNumber = 1;
    this._updateListSubject.next(this.listServerRequest);
  }

  /**
   * every time all list reload requested this method should be called
   * @param searchWord simple word for filtering all columns off list
   * the result should contain this input at least in on of columns
   */
  onReloadList(searchWord: string) {
    if (this._listServerRequest.queryWord !== searchWord) {
      this._listServerRequest.pageNumber = 1;
    }
    this._listServerRequest.queryWord = searchWord;
    this._updateListSubject.next(this.listServerRequest);
  }

  /**
   * every list may have an advanced filter.
   * if this filter is changed this method should be called
   * pay attention if advanced filter is changed simple filter will be removed
   */
  onAdvancedFilterChange(advancedFilter: any) {
    this._listServerRequest.queryWord = this._listServerRequest.queryWord ?? '';
    this._listServerRequest.advancedFilter = advancedFilter;
    this._listServerRequest.pageNumber = 1;
    this._updateListSubject.next(this.listServerRequest);
  }

  /**
   * for distroying subject by users of this class
   */
  destroy() {
    this._updateListSubject.complete();
  }
}
