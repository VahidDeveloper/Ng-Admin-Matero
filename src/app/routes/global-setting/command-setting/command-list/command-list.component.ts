import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommandSettingModel, CommandSettingService, ToastService, TemplateId } from '@shared';

/**
 * this component is created for show list of commands
 */
@Component({
  selector: 'app-command-list',
  templateUrl: './command-list.component.html',
  styleUrls: ['./command-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandListComponent implements OnInit {
  /**
   * list of commands
   */
  rows: CommandSettingModel[] = [];
  /**
   * columns data needed for data-table
   */
  columns: any[] = [
    {
      sortable: true,
      prop: 'id',
      name: this._translatorService.instant('Id'),
    },
    {
      sortable: true,
      prop: 'name',
      name: this._translatorService.instant('name'),
    },
    {
      prop: 'description',
      name: this._translatorService.instant('description'),
    },
  ];
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  allPossibleErrors = new Map<string, string>();
  /**
   * flag for indicating when component is busy with fetching data
   */
  _isLoading = false;
  /**
   * table's grid options.
   */
  _gridOption: any = {
    resizable: false,
    columnDraggable: false,
  };
  /**
   * list of operations list.
   */
  _operationList: any[] = [
    {
      id: 0,
      description: this._translatorService.instant('DeleteCommandGroups'),
      color: 'error',
      icon: 'icon-Delete-00',
      actionFn: (row: CommandSettingModel) => this._openDeleteConfirmationModal(row),
    },
    {
      id: 1,
      description: this._translatorService.instant('EditCommandGroups'),
      color: 'success',
      icon: 'icon-Write-00',
      actionFn: (row: CommandSettingModel) => this._openEditCommandModal(row),
    },
  ];
  /**
   * selected command
   */
  _selectedCommand: CommandSettingModel | undefined;
  @ViewChild('addEditModal') private _addEditModalTemp: TemplateRef<any> | undefined;

  /**
   * label of pagination per locality
   */
  paginationLabels: any;

  constructor(
    private _commandService: CommandSettingService,
    private _cdr: ChangeDetectorRef,
    private _toastService: ToastService,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._translatePaginationLabels();
    this._gridOption.searchPlaceHolder = this._translatorService.instant('search');
    this._gridOption.addOperations = [
      {
        description: this._translatorService.instant('addNewCommandGroups'),
        actionFn: () => this._openAddCommandModal(),
      },
    ];
    this._getCommandList();
  }

  /**
   * reload command list
   */
  reloadList() {
    this._getCommandList();
  }

  private _translatePaginationLabels() {
    // this.paginationLabels = new PaginationLabels();
    // this._winaCustomTranslateService.instantTablePagination(this.paginationLabels);
  }

  /**
   * get commands from api
   */
  private _getCommandList() {
    this._isLoading = true;
    this._commandService.getCommandList().subscribe(
      (res: CommandSettingModel[]) => {
        this.rows = [...res];
        this._isLoading = false;
        this._cdr.markForCheck();
      },
      (error: any) => {
        this.allPossibleErrors.set(
          error.location,
          this._translatorService.instant('AnErrorOccurredDuringGetCommandGroups')
        );
        this._isLoading = false;
        this._cdr.markForCheck();
      }
    );
  }

  /**
   * it will open new modal for adding new command
   */
  private _openAddCommandModal(): void {
    this._selectedCommand = undefined;
    // this._modalService
    //   .showModal(this._addEditModalTemp, {
    //     backdrop: 'static',
    //     submitBtnLabel: this._translatorService.instant('Submit'),
    //     cancelBtnLabel: this._translatorService.instant('close'),
    //   })
    //   .subscribe(
    //     () => {
    //       this._getCommandList();
    //     },
    //     () => {
    //       this._selectedCommand = undefined;
    //     }
    //   );
  }

  /**
   * it will open modal for editing selected command
   */
  private _openEditCommandModal(command: CommandSettingModel): void {
    this._selectedCommand = command;
    // this._modalService.showModal(this._addEditModalTemp, {backdrop: 'static'}).subscribe(
    //   () => {
    //     this._getCommandList();
    //   },
    //   () => {
    //     this._selectedCommand = new CommandSettingModel();
    //   }
    // );
  }

  /**
   * open confirmation dialog before delete selected command
   */
  private _openDeleteConfirmationModal(command: CommandSettingModel): void {
    // this._confirmService
    //   .openTextual(`${this._translatorService.instant('AreYouSureYouWantToDelete')} ${command.name}?`)
    //   .subscribe(() => {
    //     this._deleteCommand(command);
    //   });
  }

  /**
   * it will delete selected command
   */
  private _deleteCommand(command: CommandSettingModel): void {
    const ids: TemplateId[] = [{ templateId: command.id }];
    this._commandService.deleteCommand(ids).subscribe(
      () => {
        this._toastService.open(
          this._translatorService.instant('commandsGroupRemovedSuccessfully'),
          'success'
        );
        this._getCommandList();
      },
      (error: any) => {
        this.allPossibleErrors.set(
          error.location,
          this._translatorService.instant('AnErrorOccurredDuringWhenDeleteSelectedCommandsGroup')
        );
      }
    );
  }
}
