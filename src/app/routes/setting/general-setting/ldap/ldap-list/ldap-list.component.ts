import { ActivatedRoute, Router } from '@angular/router';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { LdapService } from '../_services/ldap.service';
import { LdapServerModel } from '../_models/ldap-server-model';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService, ToastService } from '@shared';

/** a component for show all ldap server in datatable and management them
 * deleting and edit by ldap id
 */
@Component({
  selector: 'app-ldap-list',
  templateUrl: './ldap-list.component.html',
  styleUrls: ['./ldap-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LdapListComponent implements OnInit {
  /**
   * which contains table rows data
   */
  _data: LdapServerModel[] = [];
  /**
   * columns data needed for ngx-datatable
   */
  _columns: any[] | undefined;
  /**
   * table's operation list to be shown on table's operation column.
   */
  _operationList: readonly any[];
  /**
   * flag for indicating when component is busy with fetching data
   */
  _isLoading = false;
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();

  /** boolean values template for ldap serve information  */
  @ViewChild('booleanTemp', { static: true }) private _booleanValTemp: TemplateRef<any> | undefined;

  constructor(
    private _ldapService: LdapService,
    private _router: Router,
    private _toast: ToastService,
    private _confirmationModalService: ConfirmDialogService,
    private _activatedRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {
    this._operationList = [
      {
        id: 0,
        description: this._translatorService.instant('Edit'),
        icon: 'icon-Write-00',
        color: 'success',
        actionFn: (rowData: any) => {
          this._editItem(rowData);
        },
      },
      {
        id: 0,
        description: this._translatorService.instant('Delete'),
        color: 'danger',
        icon: 'icon-Delete-00',
        actionFn: (rowData: any) => {
          this._deleteItem(rowData);
        },
      },
    ];
  }

  /** get all ldap server in initialize time */
  ngOnInit(): void {
    // this._tableOption.searchPlaceHolder = this._translatorService.instant('search');
    // this._tableOption.addOperations = [
    //   {
    //     description: this._translatorService.instant('add'),
    //     icon: 'icon-Plus-00',
    //     actionFn: () => {
    //       this._router.navigate(['add'], { relativeTo: this._activatedRoute }).then();
    //     },
    //   },
    // ];
    this._setColumns();
    this._getLdapServerListData();
  }

  /** set ldap server datatable columns */
  private _setColumns(): void {
    this._columns = [
      { name: this._translatorService.instant('ServerAddress'), prop: 'address' },
      { name: this._translatorService.instant('Port'), prop: 'port' },
      { name: this._translatorService.instant('BaseDn'), prop: 'baseDn' },
      { name: this._translatorService.instant('UserDn'), prop: 'userDn' },
      {
        name: this._translatorService.instant('ActiveDirectory'),
        prop: 'activeDirectory',
        cellTemplate: this._booleanValTemp,
      },
      {
        name: this._translatorService.instant('Tls'),
        prop: 'tls',
        cellTemplate: this._booleanValTemp,
      },
      {
        name: this._translatorService.instant('IgnoreCertificate'),
        prop: 'ignoreCert',
        cellTemplate: this._booleanValTemp,
      },
      {
        name: this._translatorService.instant('AcceptCertificate'),
        prop: 'acceptCert',
        cellTemplate: this._booleanValTemp,
      },
    ];
  }

  /** it will get list of ldap servers */
  _getLdapServerListData(): void {
    this._isLoading = true;
    this._cdr.markForCheck();
    this._ldapService
      .getList()
      .subscribe(
        (data: LdapServerModel[]) => {
          this._data = data;
        },
        err => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('ldapServersError')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /** it will navigate to edit page with selected ldap server id for edit that */
  private _editItem(item: LdapServerModel): void {
    this._router
      .navigate([`edit/${item.id}`], { relativeTo: this._activatedRoute, state: item })
      .then();
  }

  /** it will delete selected ldap server with send item id to server */
  private _deleteItem(item: LdapServerModel): void {
    if (item.id) {
      // this._confirmationModalService
      //   .openTextual(
      //     `${this._translatorService.instant('AreYouSureYouWantToDeleteServerWithAddress')} "${item.address}"?`,
      //     {
      //       title: this._translatorService.instant('DeleteLdapServer'),
      //       submitLabel: this._translatorService.instant('YesDeleteIt'),
      //       cancelLabel: this._translatorService.instant('cancel'),
      //     }
      //   )
      //   .subscribe(() => {
      //     this._ldapService.deleteServer(item.id).subscribe(
      //       () => {
      //         this._toast.showSuccessToast(this._translatorService.instant('LdapServerSuccessRemoval'));
      //         this._getLdapServerListData();
      //       },
      //       err => {
      //         this._allPossibleErrors.set(err.location, this._translatorService.instant('LdapServerRemovalError'));
      //       }
      //     );
      //   });
    }
  }
}
