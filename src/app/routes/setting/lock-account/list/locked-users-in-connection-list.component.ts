import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { LockedUser } from '../_models/locked-user';
import { LockedUsersInConnectionService } from '../_services/locked-users-in-connection.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '@shared/services';
/**
 * this component is created to show list of blocked users
 */
@Component({
  selector: 'app-locked-users-in-connection-list',
  templateUrl: './locked-users-in-connection-list.component.html',
  styleUrls: ['./locked-users-in-connection-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LockedUsersInConnectionListComponent implements OnInit {
  /**
   * list of Blocked Users
   */
  rows: LockedUser[] = [];
  /**
   * columns data needed for data-table
   */
  columns: any[] = [
    {
      sortable: true,
      prop: 'username',
      name: this._translatorService.instant('username'),
    },
    {
      prop: 'connectionName',
      name: this._translatorService.instant('ConnectionName'),
    },
    {
      sortable: true,
      prop: 'ldapServer',
      name: this._translatorService.instant('LdapServer'),
    },
    {
      prop: 'ipAddress',
      name: this._translatorService.instant('IPAddress'),
    },
    {
      prop: 'protocol',
      name: this._translatorService.instant('Protocol'),
    },
    {
      prop: 'os',
      name: this._translatorService.instant('OS'),
    },
  ];
  /**
   * for showing alert for each possible error on get blocked users
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * flag for indicating when component is busy with fetching data
   */
  _isLoading = false;
  /**
   * list of operations list.
   */
  _operationList: any[] = [
    {
      id: 0,
      description: this._translatorService.instant('UnlockUserAccount'),
      color: 'error',
      icon: 'icon-Lock-02',
      actionFn: (row: LockedUser) => {
        this._openUnBlockConfirmModal(row);
      },
    },
  ];

  constructor(
    private _blockedUsersService: LockedUsersInConnectionService,
    private _cdr: ChangeDetectorRef,
    private _toastService: ToastService,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._getBlockedUser();
  }

  /**
   * reload command list
   */
  reloadList() {
    this._getBlockedUser();
  }

  /**
   * get list of blocked users in a connection
   */
  private _getBlockedUser() {
    this._isLoading = true;
    this._blockedUsersService
      .getAll()
      .subscribe(
        (res: LockedUser[]) => {
          this.rows = res;
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileGettingTheAccountLockSettings')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * open confirmation modal to confirmed unblock user
   */
  private _openUnBlockConfirmModal(blockUser: LockedUser) {
    // const configs: ConfirmationModalConfigs = {
    //   cancelColor: ColorEnum.Warning,
    //   submitLabel: this._translatorService.instant('YesUnlockIt'),
    //   title: this._translatorService.instant('UnlockUserAccount'),
    // };
    // this._confirmationModalService
    //   .openTextual(
    //     `${this._translatorService.instant('AreYouSureYouWantToUnlockUserAccount')}
    //     "${blockUser.username}"
    //     ${this._translatorService.instant('inConnection')}
    //     "${blockUser.connectionName}"
    //     ${this._translatorService.instant('connection')}`,
    //     configs
    //   )
    //   .subscribe(() => {
    //     const user: Partial<LockedUser> = {
    //       username: blockUser.username,
    //       ldapServer: blockUser.ldapServer,
    //       connectionId: blockUser.connectionId,
    //     };
    //     this._unBlockUser(user);
    //   });
  }

  /**
   * this method send a user to server to unblocked it
   */
  private _unBlockUser(user: Partial<LockedUser>) {
    this._isLoading = true;
    this._blockedUsersService
      .unLockConnection(user)
      .subscribe(
        (res: Partial<LockedUser>) => {
          this._toastService.open(
            `${this._translatorService.instant('UserAccount')} "${res.username}" ${this._translatorService.instant(
              'unlockedSuccessfully'
            )}`,
            'success'
          );
          this.reloadList();
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileUnlockedUserAccount')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }
}
