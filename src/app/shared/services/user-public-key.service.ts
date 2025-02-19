import { Observable, of } from 'rxjs';
import * as forge from 'node-forge';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { csrfInfo, WinaRestUrls } from '@shared/models';
import { ToastService } from './toast.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class UserPublicKeyService {
  /**
   * user's public key string.
   * it is used for encryption. for example, encrypting username/password in remote connections.
   */
  private _userPublicKey: string | undefined;
  private readonly tr = inject(TranslateService);
  private readonly toast = inject(ToastService);
  private readonly http = inject(HttpClient);

  constructor() {}

  /**
   * it would get user's public key for encryption
   * if it has already stored in this service, it would be used. Otherwise, it would be gotten from server.
   */
  getUserPublicKey(): Observable<string> {
    if (this._userPublicKey) {
      // => it is already gotten.
      return of(this._userPublicKey);
    } else {
      return this._getUserPublicKeyFromServer();
    }
  }

  /**
   * it would return encrypted value of the input based on public-key.
   */
  getEncryptedValue(userPublicKey: string, input: string | undefined): string | undefined {
    if (input == null) {
      return undefined;
    }
    const key = forge.pki.publicKeyFromPem(userPublicKey);
    return key.encrypt(forge.util.encodeUtf8(input), 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
  }

  /**
   * it would calculate encrypted csrf.
   */
  calculateEncryptedCsrf(): void {
    if (csrfInfo.csrf) {
      // as we expected
      this.getUserPublicKey().subscribe({
        next: (userPublicKey: string) => {
          csrfInfo.encryptedCsrf = this.getEncryptedValue(userPublicKey, csrfInfo.csrf);
        },
        error: () => {
          this.toast.open(this.tr.instant('calculateEncryptedCsrfError1'), 'error');
        },
      });
    } else {
      // should not occur unless there is a problem in core.
      this.toast.open(this.tr.instant('calculateEncryptedCsrfError2'), 'error');
    }
  }

  /**
   * user's public key would be gotten from server.
   */
  private _getUserPublicKeyFromServer(): Observable<string> {
    return this.http.post<{ key: string }>(WinaRestUrls.userPublicKeyURL(), {}).pipe(
      map(data => data.key),
      tap((publicKey: string) => {
        this._userPublicKey = publicKey;
      })
    );
  }
}
