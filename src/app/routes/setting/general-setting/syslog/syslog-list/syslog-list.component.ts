import { ActivatedRoute, Router } from '@angular/router';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

import { SyslogService } from '../_services/syslog.service';
import { SyslogServerModel } from '../_models/syslog-server';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogService } from '@shared';

/** a component for show all syslog server in datatable and management them
 * deleting and edit by syslog id
 */
@Component({
  selector: 'app-syslog-list',
  templateUrl: './syslog-list.component.html',
  styleUrls: ['./syslog-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyslogListComponent implements OnInit {
  /**
   * which contains table rows data
   */
  _data: SyslogServerModel[] = [];
  /**
   * columns data needed for Grid
   */
  _columns: any[];
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

  constructor(
    private _syslogService: SyslogService,
    private _router: Router,
    private _confirmationModalService: ConfirmDialogService,
    private _activatedRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {
    this._columns = [
      { name: this._translatorService.instant('ServerAddress'), prop: 'address' },
      { name: this._translatorService.instant('Port'), prop: 'port' },
      { name: this._translatorService.instant('Protocol'), prop: 'protocol' },
      { name: this._translatorService.instant('ActiveSsl'), prop: 'ssl' },
      { name: this._translatorService.instant('IgnoreCertificate'), prop: 'ignoreCert' },
      { name: this._translatorService.instant('SubCategories'), prop: 'subCategories' },
    ];
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

  /** get all syslog server in initialize time */
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
    this._getSyslogServerListData();
  }

  /** it will get list of syslog servers */
  _getSyslogServerListData(): void {
    this._isLoading = true;
    this._cdr.markForCheck();
    this._syslogService
      .getList()
      .subscribe(
        (data: SyslogServerModel[]) => {
          this._data = data;
        },
        err => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('SyslogServersError')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /** it will navigate to edit page with selected syslog server id for edit that */
  private _editItem(item: SyslogServerModel): void {
    this._router
      .navigate([`edit/${item.id}`], { relativeTo: this._activatedRoute, state: item })
      .then();
  }

  /** it will delete selected syslog server with send item id to server */
  private _deleteItem(item: SyslogServerModel): void {
    if (item.id) {
      this._confirmationModalService
        .confirm(
          this._translatorService.instant('DeleteSyslogServer'),
          `${this._translatorService.instant('AreYouSureYouWantToDeleteServerWithAddress')} "${item.address}"?`
        )
        .subscribe(() => {
          this._syslogService.deleteServer(item.id).subscribe(
            () => {
              // TODO: show success toast
              this._getSyslogServerListData();
            },
            err => {
              this._allPossibleErrors.set(
                err.location,
                this._translatorService.instant('AnErrorOccurredDuringDeletingSelectedSyslogServer')
              );
            }
          );
        });
    }
  }
}
