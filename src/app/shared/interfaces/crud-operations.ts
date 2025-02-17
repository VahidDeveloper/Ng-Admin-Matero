import { Observable } from 'rxjs';
import { ListServerRequest } from '../models/list-server-request';
import { ListServerResponse } from './list-server-response';

/**
 * this interface is created to manage actions for http service as a generic service
 */
export interface ICrudOperations<T> {
  /**
   * to save data
   */
  save(t: T): Observable<T>;

  /**
   * to update data
   */
  update(t: T): Observable<T>;

  /**
   * to get single data
   */
  getById(id: number | string): Observable<T | T[]>;

  /**
   * to get all data withOut pagination
   */
  getAll(): Observable<T[]>;

  /**
   * to get single data
   */
  getData(): Observable<T>;

  /**
   * to get filter data with pagination
   */
  advanceSearch(listServerRequest: ListServerRequest): Observable<ListServerResponse<T>>;

  /**
   * to delete single data
   */
  delete(id: number | string): Observable<T>;

  /**
   * to handle batch delete
   */
  deleteAll(t: T[]): Observable<T>;
}
