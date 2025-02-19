import { Observable } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ICrudOperations, ListServerResponse } from '@shared/interfaces';
import { ListServerRequest } from '@shared/models';

/**
 * this service is created to manage all methods of restful api
 *
 */
@Injectable({
  providedIn: 'root',
})
export abstract class GenericCrudService<T> implements ICrudOperations<T> {
  protected constructor(
    protected _http: HttpClient,
    @Inject(String) protected _base: string
  ) {}

  /**
   * it will sava data
   */
  save(t: T): Observable<T> {
    return this._http.post<T>(this._base, t);
  }

  /**
   * it will update data
   */
  update(t: T): Observable<T> {
    return this._http.put<T>(this._base, t, {});
  }

  /**
   * it will get data by id
   */
  getById(id: number | string): Observable<T | T[]> {
    return this._http.get<T>(this._base + '/' + id);
  }

  /**
   * it will get all data
   */
  getAll(): Observable<T[]> {
    return this._http.get<T[]>(this._base);
  }

  /**
   * it will get single data
   */
  getData(): Observable<T> {
    return this._http.get<T>(this._base);
  }

  /**
   * it will get all data with pagination and filter data
   */
  advanceSearch(listServerRequest: ListServerRequest): Observable<ListServerResponse<T>> {
    return this._http.post<ListServerResponse<T>>(
      this._base + '/advanced-search',
      listServerRequest
    );
  }

  /**
   * it will delete single data
   */
  delete(id: number | string): Observable<T> {
    return this._http.delete<T>(this._base + '/' + id);
  }

  /**
   * it will delete batch data
   */
  deleteAll(t: T[]): Observable<T> {
    return this._http.post<T>(this._base + '/delete', t);
  }
}
