import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RemoteMachineExtended, ListServerResponse } from '@shared/interfaces';
import {
  FilterRemoteMachines,
  ListServerRequest,
  RowCount,
  ServerSideListHelper,
} from '@shared/models';
import { RemoteMachineService } from '@shared/services';

/**
 * a component to enable choosing one or multiple remote-machines.
 */
@Component({
  selector: 'app-remote-machines-selector',
  templateUrl: './remote-machines-selector.component.html',
  styleUrls: ['./remote-machines-selector.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule],
})
export class RemoteMachinesSelectorComponent implements OnInit {
  /**
   * the initial filter.
   * for example, sometimes we opt to show machines with windows operating systems.
   * in this case, we should set initialFilter properly to see our desired nodes.
   */
  @Input() initialFilter: FilterRemoteMachines | undefined;
  /** if true, we enable choosing only one remote-machine */
  @Input() isSingularSelection: boolean | undefined;
  /**
   * the filter which would be sent to server.
   * it would consider initialFilter too.
   */
  _filter = new FilterRemoteMachines();
  /**
   * a field for handling list listServerRequest
   */
  listServerRequest: ListServerRequest | undefined;
  /** whether to show advanced search or not */
  _showFilters: boolean | undefined;
  /** when true loading would be shown */
  _isLoading: boolean | undefined;
  /** list of remote-machines list which would be shown on screen */
  _remoteMachinesList: RemoteMachineExtended[] = [];
  /** list of selected remotes. */
  _selectedRemotes: RemoteMachineExtended[] = [];
  /**
   * filterCount and totalCount in lists
   */
  _rowCountInfo: RowCount | undefined;
  /** to manage event associated with the list */
  _serverSideListHelper = new ServerSideListHelper(new ListServerRequest(0, 50));
  /** options for showing grid-items */
  _gridOptions: any;

  constructor(
    private _remoteMachineService: RemoteMachineService,
    private _cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.initialFilter) {
      // if it has value, take it into consideration in _filter field.
      this._filter = this.initialFilter.clone();
    }
    this._gridOptions.rowSelectable = true;
    this._gridOptions.showFilterButton = false;
    this._serverSideListHelper.updateList.subscribe((req: ListServerRequest) => {
      this.listServerRequest = req;
      this.getRemoteMachinesList();
    });
  }

  /**
   * it would get remote-machines list from server.
   */
  getRemoteMachinesList(): void {
    this._isLoading = true;
    if (this.listServerRequest) {
      this._remoteMachineService
        .getRemoteMachines(this._filter, this.listServerRequest)
        .subscribe((data: ListServerResponse<RemoteMachineExtended>) => {
          if (this.listServerRequest && this.listServerRequest?.pageNumber > 1) {
            this._remoteMachinesList = [...this._remoteMachinesList, ...data.results];
          } else {
            this._remoteMachinesList = data.results;
          }
          this._rowCountInfo = new RowCount(data.filterCount, data.totalCount);
        })
        .add(() => {
          this._isLoading = false;
          this._cdr.markForCheck();
        });
    }
  }

  /**
   * it is called when the user change selected remotes.
   */
  _changeSelectedRemotes(selectedRemotes: RemoteMachineExtended[]): void {
    if (this.isSingularSelection && selectedRemotes.length > 1) {
      // isSingularSelection mode, only one item can be selected, which is why we use [selectedRemotes[1]];
      this._selectedRemotes = [selectedRemotes[1]];
    } else {
      this._selectedRemotes = selectedRemotes;
    }
  }

  /**
   * it would toggle advanced search filter.
   */
  toggleFilter(): void {
    this._showFilters = !this._showFilters;
    if (this.initialFilter) {
      this._filter = this.initialFilter.clone();
    } else {
      this._filter = new FilterRemoteMachines();
    }
    this._serverSideListHelper.onAdvancedFilterChange(this._filter);
  }

  /** filter the list based on advanced-search filters. */
  _onFilter(filter: FilterRemoteMachines): void {
    this._filter = filter;
    this._serverSideListHelper.onAdvancedFilterChange(this._filter);
  }
}
