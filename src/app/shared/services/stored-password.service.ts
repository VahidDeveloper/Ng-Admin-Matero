import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrganizationalPassword } from '@shared/interfaces';
import { StoredPassword, WinaRestUrls } from '@shared/models';

@Injectable({
  providedIn: 'root',
})
export class StoredPasswordService {
  constructor(private http: HttpClient) {}

  getConnectionStoredPasswords(): Observable<StoredPassword[]> {
    return this.getAllStoredPasswords(false);
  }

  getPersonalStoredPasswords(): Observable<StoredPassword[]> {
    return this.getAllStoredPasswords(true);
  }

  /**
   * it would get all StoredPassword
   * @param isPersonal whether it is personal or associated with connection
   */
  getAllStoredPasswords(isPersonal: boolean): Observable<StoredPassword[]> {
    const address = isPersonal
      ? WinaRestUrls.personalVaultURL()
      : WinaRestUrls.connectionVaultURL();
    return this.http.get<StoredPassword[]>(address, {}).pipe(
      map(items => {
        return items.map(sc => new StoredPassword(sc));
      })
    );
  }

  /**
   * it would add/edit StoredPassword according to the specified fields.
   * @param isPersonal whether it is personal or associated with connection
   * @param sendObj StoredPassword's
   */
  addEditStoredPassword(isPersonal: boolean, sendObj: StoredPassword): Observable<StoredPassword> {
    const data = sendObj;
    if (!data.id) {
      // => it is in adding mode => id should not be sent.
      delete data.id;
    }
    const address = isPersonal
      ? WinaRestUrls.personalVaultURL()
      : WinaRestUrls.connectionVaultURL();
    return sendObj.id
      ? this.http.put<StoredPassword>(address, data)
      : this.http.post<StoredPassword>(address, data);
  }

  /**
   * it would delete StoredPassword.
   * @param isPersonal whether it is personal or associated with connection
   * @param id StoredPassword's id
   */
  deleteStoredPassword(isPersonal: boolean, id: number): Observable<boolean> {
    const sendObj = {
      id,
    };
    const address = isPersonal
      ? WinaRestUrls.personalVaultURL()
      : WinaRestUrls.connectionVaultURL();
    return isPersonal
      ? this.http.delete<boolean>(`${address}/${id}`)
      : this.http.post<boolean>(address, sendObj);
  }

  /**
   * it would get all organizational passwords
   */
  getAllOrganizationalPasswords(): Observable<OrganizationalPassword[]> {
    return this.http.get<OrganizationalPassword[]>(`${WinaRestUrls.vaultsConfig()}`);
  }

  /**
   * it would add organizational password
   * @param sendObj OrganizationalPassword's
   */
  addOrganizationalPassword(sendObj: OrganizationalPassword): Observable<OrganizationalPassword> {
    return this.http.post<OrganizationalPassword>(`${WinaRestUrls.vaultsConfig()}`, sendObj);
  }

  /**
   * it would delete organizational password
   * @param id OrganizationalPassword's id
   */
  deleteOrganizationalPassword(id: number): Observable<boolean | null> {
    return this.http.delete<boolean | null>(`${WinaRestUrls.vaultsConfig()}/${id}`);
  }

  /**
   * it would edit organizational password
   * @param sendObj OrganizationalPassword's
   */
  editOrganizationalPassword(
    sendObj: OrganizationalPassword
  ): Observable<OrganizationalPassword | null> {
    return this.http.put<OrganizationalPassword | null>(`${WinaRestUrls.vaultsConfig()}`, sendObj);
  }
}
