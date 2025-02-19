import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StoredPassword, StoredPasswordService, ToastService } from '@shared';

/** a component for management user password history */
@Component({
  selector: 'app-password-list',
  templateUrl: './password-list.component.html',
  styleUrls: ['./password-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordListComponent implements OnInit {
  @ViewChild('addEditModal') private _addEditModalTemp: TemplateRef<any> | undefined;

  /**
   * label of pagination per locality
   */
  paginationLabels = new Object();

  _title: string | undefined;
  _isPersonalPage: boolean | undefined;
  /** columns of data table */
  _columns: any[] = [
    {
      sortable: true,
      prop: 'id',
      name: this._translatorService.instant('Id'),
    },
    {
      sortable: true,
      prop: 'username',
      name: this._translatorService.instant('username'),
    },
    {
      sortable: true,
      prop: 'domain',
      name: this._translatorService.instant('domain'),
    },
    {
      sortable: true,
      prop: 'identifierKey',
      name: this._translatorService.instant('identifierKey'),
    },
  ];
  /**
   * show loading bar
   */
  _isLoading = false;

  /**
   * list of possible operations list.
   */
  _operationList: any[] = [
    {
      id: 0,
      description: this._translatorService.instant('DeletePassword'),
      icon: 'icon-Delete-00',
      color: 'error',
      actionFn: (data: StoredPassword) => this._openDeleteConfirmationModal(data),
    },
    {
      id: 1,
      description: this._translatorService.instant('EditPassword'),
      icon: 'icon-Write-00',
      color: 'success',
      actionFn: (data: StoredPassword) => this._openEditPasswordModal(data),
    },
  ];
  /** list of all password */
  _passwordList: readonly StoredPassword[] | undefined;
  _selectedPasswordModel: StoredPassword | undefined;
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();

  constructor(
    private _cdr: ChangeDetectorRef,
    private _storedCredentialsService: StoredPasswordService,
    private _activatedRoute: ActivatedRoute,
    private _toast: ToastService,
    private _translatorService: TranslateService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._isPersonalPage = this._activatedRoute.snapshot.routeConfig?.path === 'my-pass';
    // this._gridOption?.addOperations = [
    //   {
    //     description: this._translatorService.instant('AddNewPassword'),
    //     actionFn: () => this._openAddPasswordModal(),
    //   },
    // ];
    this._setCardTitle();
    this._getList();
  }

  /**
   * fetch new password lis and refresh datatable list
   */
  onRefreshData(): void {
    this._getList();
  }

  /**
   * it calls when password type changed
   */
  changePasswordType(item: any): void {
    switch (item.target.value) {
      case 'MY_PASSWORDS': {
        this._router
          .navigate(['/global-setting/password/my-pass'], { relativeTo: this._activatedRoute })
          .then();
        break;
      }
      case 'CONNECTION_PASSWORD': {
        this._router
          .navigate(['/global-setting/password/connections-pass'], {
            relativeTo: this._activatedRoute,
          })
          .then();
        break;
      }
      case 'ORGANIZATIONAL_PASSWORD': {
        this._router
          .navigate(['/global-setting/password/organizational-pass'], {
            relativeTo: this._activatedRoute,
          })
          .then();
        break;
      }
      default: {
        this._router
          .navigate(['/global-setting/password/my-pass'], { relativeTo: this._activatedRoute })
          .then();
        break;
      }
    }
  }

  private _setCardTitle(): void {
    this._title = this._isPersonalPage
      ? this._translatorService.instant('MY_PASSWORDS')
      : this._translatorService.instant('CONNECTION_PASSWORD');
  }

  /**
   * it will fetch new password lis from server
   */
  private _getList(): void {
    this._isLoading = true;
    this._storedCredentialsService
      .getAllStoredPasswords(this._isPersonalPage!)
      .subscribe(
        res => {
          this._passwordList = res;
        },
        error => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('AnErrorOccurredDuringGetPasswordList')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * it will open new modal for adding new password
   */
  private _openAddPasswordModal(): void {
    this._selectedPasswordModel = new StoredPassword({});
    // this._modalService
    //   .showModal(this._addEditModalTemp, {
    //     backdrop: 'static',
    //     submitBtnLabel: this._translatorService.instant('Submit'),
    //     cancelBtnLabel: this._translatorService.instant('close'),
    //   })
    //   .subscribe(
    //     () => {
    //       this._getList();
    //     },
    //     () => {
    //     },
    // );
  }

  /**
   * it will open modal for editing selected password
   */
  private _openEditPasswordModal(data: StoredPassword): void {
    this._selectedPasswordModel = new StoredPassword({});
    this._selectedPasswordModel = data;
    // this._modalService
    //   .showModal(this._addEditModalTemp, {
    //     backdrop: 'static',
    //     submitBtnLabel: this._translatorService.instant('Submit'),
    //     cancelBtnLabel: this._translatorService.instant('close'),
    //   })
    //   .subscribe(
    //     () => {
    //       this._getList();
    //     },
    //     () => {
    //     },
    //   );
  }

  /**
   * open confirmation dialog before delete selected password and get confirm form user
   * @param data:PasswordSettingModel
   */
  private _openDeleteConfirmationModal(data: StoredPassword): void {
    // this._confirmService
    //   .openTextual(`${this._translatorService.instant('AreYouSureYouWantToDelete')} ${data.username}?`, {
    //     submitLabel: this._translatorService.instant('YesDeleteIt'),
    //     cancelLabel: this._translatorService.instant('No'),
    //   })
    //   .subscribe(() => {
    //     this._deletePassword(data);
    //   });
  }

  /**
   * it will delete selected password
   * @param data:PasswordSettingModel
   */
  private _deletePassword(data: StoredPassword): void {
    this._isLoading = true;
    this._storedCredentialsService
      .deleteStoredPassword(this._isPersonalPage!, data.id!)
      .subscribe(
        () => {
          this._toast.open(
            this._translatorService.instant('PasswordRemovalCompletedSuccessfully'),
            'success'
          );
          this._getList();
        },
        error => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('AnErrorOccurredDuringWhenDeleteSelectedPassword')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }
}
