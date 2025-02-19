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
import { OrganizationalPassword, StoredPasswordService, ToastService } from '@shared';

@Component({
  selector: 'app-organizational-password-list',
  templateUrl: './organizational-password-list.component.html',
  styleUrls: ['./organizational-password-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganizationalPasswordListComponent implements OnInit {
  @ViewChild('addEditModal') private _addEditModalTemp: TemplateRef<any> | undefined;

  _title: string | undefined;
  /** columns of data table */
  _columns: any[] = [
    {
      sortable: true,
      prop: 'id',
      name: this._translatorService.instant('Id'),
    },
    {
      sortable: false,
      prop: 'address',
      name: this._translatorService.instant('address'),
    },
    {
      sortable: true,
      prop: 'readonly',
      name: this._translatorService.instant('readonly'),
    },
    {
      sortable: true,
      prop: 'ssl',
      name: this._translatorService.instant('ssl'),
    },
  ];
  /**
   * show loading bar
   */
  _isLoading = false;
  /**
   * table's grid options.
   */
  /**
   * list of possible operations list.
   */
  _operationList: any[] = [
    {
      id: 0,
      description: this._translatorService.instant('DeletePassword'),
      icon: 'icon-Delete-00',
      color: 'error',
      actionFn: (data: OrganizationalPassword) => this._openDeleteConfirmationModal(data),
    },
    {
      id: 1,
      description: this._translatorService.instant('EditPassword'),
      icon: 'icon-Write-00',
      color: 'success',
      actionFn: (data: OrganizationalPassword) => this._openEditPasswordModal(data),
    },
  ];
  /** list of all password */
  _passwordList: readonly OrganizationalPassword[] | undefined;
  /** selected password */
  _selectedPasswordModel: OrganizationalPassword | undefined;
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
    // this._gridOption.searchPlaceHolder = this._translatorService.instant('search');
    // this._gridOption.addOperations = [
    //   {
    //     description: this._translatorService.instant('AddNewPassword'),
    //     actionFn: () => this._openAddPasswordModal(),
    //   },
    // ];
    this._getList();
  }

  /**
   * fetch new password list and refresh datatable list
   */
  onRefreshData(): void {
    this._getList();
  }

  /**
   * it will fetch new password list from server
   */
  private _getList(): void {
    this._isLoading = true;
    this._storedCredentialsService
      .getAllOrganizationalPasswords()
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
   * it will open new modal to add new password
   */
  private _openAddPasswordModal(): void {
    // this._modalService
    //   .showModal(this._addEditModalTemp, {
    //     backdrop: 'static',
    //     submitBtnLabel: this._translatorService.instant('Save'),
    //     cancelBtnLabel: this._translatorService.instant('close'),
    //   })
    //   .subscribe(
    //     () => {
    //       this._getList();
    //     },
    //     () => {}
    //   );
  }

  /**
   * it will open modal for editing selected password
   * @param data:OrganizationalPassword
   */
  private _openEditPasswordModal(data: OrganizationalPassword): void {
    this._selectedPasswordModel = data;
    // this._modalService
    //   .showModal(this._addEditModalTemp, {
    //     backdrop: 'static',
    //     submitBtnLabel: this._translatorService.instant('Save'),
    //     cancelBtnLabel: this._translatorService.instant('close'),
    //   })
    //   .subscribe(
    //     () => {
    //       this._getList();
    //     },
    //     () => {}
    //   );
  }

  /**
   * open confirmation dialog before delete selected password and get confirm form user
   * @param data:OrganizationalPassword
   */
  private _openDeleteConfirmationModal(data: OrganizationalPassword): void {
    // this._confirmService
    //   .openTextual(`${this._translatorService.instant('AreYouSureYouWantToDelete')} ${data.id}?`, {
    //     submitLabel: this._translatorService.instant('YesDeleteIt'),
    //     cancelLabel: this._translatorService.instant('No'),
    //   })
    //   .subscribe(() => {
    //     this._deletePassword(data);
    //   });
  }

  /**
   * it will delete selected password
   * @param data:OrganizationalPassword
   */
  private _deletePassword(data: OrganizationalPassword): void {
    this._isLoading = true;
    this._storedCredentialsService
      .deleteOrganizationalPassword(data.id)
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
