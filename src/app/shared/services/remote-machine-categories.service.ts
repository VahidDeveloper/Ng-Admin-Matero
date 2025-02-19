import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GenericCrudService } from './generic-crud.service';
import { ClipboardPatternsService } from './clipboard-patterns.service';
import { ForbiddenCommandsService } from './forbidden-commands.service';
import { RemoteCategory, RemoteMachineExtended } from '@shared/interfaces';
import { WinaRestUrls } from '@shared/models';

/**
 * a service which does operations associated with remote-machine's categories.
 * because list of remote-machines may become large, the categorizing capability is added for user satisfaction.
 */
@Injectable({
  providedIn: 'root',
})
export class RemoteMachineCategoriesService extends GenericCrudService<RemoteCategory> {
  /** latest remote-categories list would be stored here to do some operations locally if needed */
  private _cachedRemoteCategories: RemoteCategory[] | undefined;
  /** it would return the latest remote-categories stored locally */
  get cachedRemoteCategories(): RemoteCategory[] | undefined {
    return this._cachedRemoteCategories;
  }

  constructor(
    protected _http: HttpClient,
    private _clipboardPatternsService: ClipboardPatternsService,
    private _forbiddenCommandsService: ForbiddenCommandsService
  ) {
    super(_http, WinaRestUrls.remoteMachineCategories());
  }

  /**
   * it would get remote-machines categories from server.
   */
  getRemoteCategories(): Observable<RemoteCategory[]> {
    return super
      .getAll()
      .pipe(tap((data: RemoteCategory[]) => (this._cachedRemoteCategories = data)));
  }

  /**
   * it would find remote-category based on the specified id.
   * first of all, it would try to find it locally
   * if not found, it would send a request to server to return its info
   */
  findCategoryLocallyIfPossible(categoryId: number): Observable<RemoteCategory | undefined> {
    const foundCategory = this.cachedRemoteCategories?.find(
      (remoteCategory: RemoteCategory) => remoteCategory.id === categoryId
    );
    if (foundCategory) {
      return of(foundCategory);
    } else {
      return this.getRemoteCategories().pipe(
        map((categories: RemoteCategory[]) => {
          return categories.find(
            (remoteCategory: RemoteCategory) => remoteCategory.id === categoryId
          );
        })
      );
    }
  }

  /**
   * it would add/update the specified remote-category.
   * if id is undefined, it is in add mode. otherwise, it is in edit mode.
   * for image: the image in base64 would be sent but the first part of the image would not be sent
   * for example, instead of data:image/png;base64,iVBORw0KGg....., iVBORw0KGg..... would be sent to server.
   * Note that in edit mode, if we send null for image, category's image would not be changed.
   */
  addUpdateRemoteCategory(
    id: number,
    name: string,
    description: string,
    image: string
  ): Observable<Partial<RemoteCategory>> {
    const sendObj: RemoteCategory = {
      id,
      name,
      description,
      image: image ? image.slice(image.indexOf(',') + 1, image.length) : '',
    } as RemoteCategory;
    return super.update(sendObj);
  }

  /**
   * it would add remote-machines to the specified remote-category
   */
  addToRemoteCategory(
    categoryId: number,
    selectedRemotes: RemoteMachineExtended[]
  ): Observable<RemoteCategory> {
    const sendObj = {
      members: selectedRemotes.map(r => r.id),
      objectId: categoryId,
    };
    return this._http.put<RemoteCategory>(WinaRestUrls.remoteMachineCategory(), sendObj);
  }

  /**
   * it would remove remote-machines from the specified remote-category
   */
  removeFromRemoteCategory(
    categoryId: number,
    selectedRemotes: RemoteMachineExtended[]
  ): Observable<RemoteCategory> {
    const sendObj = {
      members: selectedRemotes.map(r => r.id),
      objectId: categoryId,
    };
    return this._http.put<RemoteCategory>(WinaRestUrls.remoteMachineCategory(), sendObj);
  }
}
