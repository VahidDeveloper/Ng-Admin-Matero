import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { FieldsToBeHiddenRemoteMachines, HiddenFieldsFilterRemoteMachines } from './types';
import { operatingSystemsList } from '@shared/constant';
import { ConnectionType } from '@shared/enums';
import { GenericListItem } from '@shared/interfaces';
import { FilterRemoteMachines } from '@shared/models';
import { OperatingSystemType } from '@shared/types';
import { FormsModule } from '@angular/forms';

/**
 * remote machines filter
 */
@Component({
  standalone: true,
  selector: 'app-filter-remote-machine',
  templateUrl: './filter-remote-machines.component.html',
  styleUrl: './filter-remote-machines.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule],
})
export class FilterRemoteMachinesComponent implements OnChanges {
  /**
   * filter which comes from outside
   */
  @Input() filter: Readonly<FilterRemoteMachines> | undefined;
  /**
   * filter which comes from outside
   */
  @Input() fieldsToBeHidden: FieldsToBeHiddenRemoteMachines[] = [];
  /**
   * it gets emitted when filter changed
   */
  @Output() filterChange = new EventEmitter<FilterRemoteMachines>();
  /**
   * it gets emitted when doSearch is called
   */
  @Output() search = new EventEmitter<FilterRemoteMachines>();
  /**
   * it gets emitted when close button of filter were clicked
   */
  @Output() closeFilter = new EventEmitter();
  /**
   * it is used to have clone of filter
   */
  filterClone = new FilterRemoteMachines();
  /**
   * different operating systems
   */
  operatingSystems: GenericListItem<OperatingSystemType>[] = operatingSystemsList;
  /**
   * selected connection protocols
   */
  selectedOperatingSystems: GenericListItem<OperatingSystemType>[] = [];
  /**
   * connection protocols list
   */
  protocols: GenericListItem<ConnectionType>[] = [
    { key: ConnectionType.RDP, label: 'RDP' },
    { key: ConnectionType.TerminalService, label: 'Terminal Service' },
    { key: ConnectionType.SSH, label: 'SSH' },
    { key: ConnectionType.VNC, label: 'VNC' },
    { key: ConnectionType.Telnet, label: 'Telnet' },
    { key: ConnectionType.Web, label: 'Web' },
  ];
  /**
   * selected connection protocols
   */
  selectedProtocols: GenericListItem<ConnectionType>[] = [];
  /**
   * its object which indicates which field should be hidden
   * its built from hiddenFields
   */
  hiddenFields = new HiddenFieldsFilterRemoteMachines();
  /**
   * a flag which gets true when a field changed
   */
  filterChanged = false;
  /**
   * has error for clientIp and remoteIp fields
   */
  hasError = false;

  /**
   * it gets called when 'filter' or 'fieldsToBeHidden' has been changed
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.filter) {
      this.patchFilter();
    }
    if (changes.fieldsToBeHidden) {
      this.setHiddenFields();
    }
  }

  /**
   * it gets called when a filed has changed
   * it will change state of filterChanged to true
   * it will call filterChange to emit filters new data
   */
  changeHandle(): void {
    this.filterChanged = true;
    this.filterChange.emit(this.convertFilter());
  }

  /**
   * by using filterIsValid (which only checks ip fields) it will first checks if ip fields
   * are valid then it will call changeHandle to submit changes
   */
  ipFieldChangeHandle(): void {
    if (this.filterIsValid()) {
      this.changeHandle();
    }
  }

  /**
   * it gets called when filters close button is being clicked
   * it will emit closeFilter
   */
  closeHandle(): void {
    this.clearHandle();
    this.closeFilter.emit();
  }

  /**
   * it gets called when filters clear button is being clicked
   * it will reset fields
   */
  clearHandle(): void {
    this.selectedProtocols = [];
    this.selectedOperatingSystems = [];
    this.filterClone = new FilterRemoteMachines();
    this.filterChanged = true;
  }

  /**
   * it gets called when search button is clicked
   */
  doSearch(): void {
    if (this.filterIsValid()) {
      this.filterChanged = false;
      this.search.emit(this.convertFilter());
    }
  }

  /**
   * it will patch filter values to filterClone
   */
  private patchFilter(): void {
    if (this.filter) {
      Object.assign(this.filterClone, this.filter);
      this.selectedProtocols = [];
      this.filter.protocols.forEach(type => {
        const found = this.protocols?.find(item => type === item.key);
        if (found) {
          this.selectedProtocols.push(found);
        }
      });
      this.selectedOperatingSystems = [];
      this.filter.operatingSystems.forEach(type => {
        const found = this.operatingSystems?.find(item => type === item.key);
        if (found) {
          this.selectedOperatingSystems.push(found);
        }
      });
    }
  }

  /**
   * it will convert filter to proper output filter
   */
  private convertFilter(): FilterRemoteMachines {
    const result = new FilterRemoteMachines();
    Object.assign(result, this.filterClone);
    result.protocols = this.selectedProtocols.map(item => item.key);
    result.operatingSystems = this.selectedOperatingSystems.map(item => item.key);
    return result;
  }

  /**
   * it will validate fields of filter
   * Currently, we have not a regex to validate ip-pattern (like 1.2.*.34) so
   * for now, we validate all expressions here but whenever the validation regex for ip-pattern is added,
   * this function would be changed.
   */
  private filterIsValid(): boolean {
    this.hasError = false;
    return !this.hasError;
  }

  /**
   * it will set hiddenFields from fieldsToBeHidden
   */
  private setHiddenFields(): void {
    this.fieldsToBeHidden?.forEach(field => {
      if (Object.prototype.hasOwnProperty.call(this.hiddenFields, field)) {
        this.hiddenFields[field] = true;
      }
    });
  }
}
