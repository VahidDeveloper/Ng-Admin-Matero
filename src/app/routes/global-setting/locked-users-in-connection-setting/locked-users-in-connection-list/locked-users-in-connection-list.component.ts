import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  ColorEnum,
  ConfirmationModalConfigs,
  ConfirmationModalService,
  DatatableOption,
  GridColumn,
  OperationItem,
  PaginationLabels,
  ToastService,
} from '@mahsan/ng-components';
import { ErrorDisplay } from '@wina/error-handler';
import { LockedUser } from '../_models/locked-user';
import { Breadcrumb, BreadcrumbItem } from '@phoenix-front-apps/ng-core';
import { WinaCustomTranslateService } from '@phoenix-front-apps/wina-core';
import { LockedUsersInConnectionService } from '../_services/locked-users-in-connection.service';
import { TranslateService } from '@phoenix-front-apps/ng-core';
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
  @Breadcrumb() breadcrumb: BreadcrumbItem = {
    text: this._translatorService.instant('LOCKED_USER_MENU'),
  };

  /**
   * list of Blocked Users
   */
  rows: LockedUser[] = [];
  /**
   * columns data needed for data-table
   */
  columns: GridColumn[] = [
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
  _operationList: OperationItem[] = [
    {
      id: 0,
      description: this._translatorService.instant('UnlockUserAccount'),
      color: ColorEnum.Danger,
      icon: 'icon-Lock-02',
      actionFn: (row: LockedUser) => {
        this._openUnBlockConfirmModal(row);
      },
    },
  ];
  /**
   * label of pagination per locality
   */
  paginationLabels = new PaginationLabels();
  _gridOption: DatatableOption = {
    ...new DatatableOption(),
    resizable: false,
    columnDraggable: false,
  };

  constructor(
    private _blockedUsersService: LockedUsersInConnectionService,
    private _cdr: ChangeDetectorRef,
    private _confirmationModalService: ConfirmationModalService,
    private _toastService: ToastService,
    private _translatorService: TranslateService,
    private _winaCustomTranslateService: WinaCustomTranslateService
  ) {}

  ngOnInit(): void {
    this._translatePaginationLabels();
    this._gridOption.searchPlaceHolder = this._translatorService.instant('search');
    this._getBlockedUser();
  }

  /**
   * reload command list
   */
  reloadList() {
    this._getBlockedUser();
  }

  private _translatePaginationLabels() {
    this.paginationLabels = new PaginationLabels();
    this._winaCustomTranslateService.instantTablePagination(this.paginationLabels);
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
        (err: ErrorDisplay) => {
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
    const configs: ConfirmationModalConfigs = {
      cancelColor: ColorEnum.Warning,
      submitLabel: this._translatorService.instant('YesUnlockIt'),
      title: this._translatorService.instant('UnlockUserAccount'),
    };
    this._confirmationModalService
      .openTextual(
        `${this._translatorService.instant('AreYouSureYouWantToUnlockUserAccount')}
        "${blockUser.username}"
        ${this._translatorService.instant('inConnection')}
        "${blockUser.connectionName}"
        ${this._translatorService.instant('connection')}`,
        configs
      )
      .subscribe(() => {
        const user: Partial<LockedUser> = {
          username: blockUser.username,
          ldapServer: blockUser.ldapServer,
          connectionId: blockUser.connectionId,
        };
        this._unBlockUser(user);
      });
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
          this._toastService.showSuccessToast(
            `${this._translatorService.instant('UserAccount')} "${res.username}" ${this._translatorService.instant(
              'unlockedSuccessfully'
            )}`
          );
          this.reloadList();
        },
        (err: ErrorDisplay) => {
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
