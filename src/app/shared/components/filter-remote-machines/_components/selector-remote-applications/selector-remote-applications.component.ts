import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RemoteApplication } from '@shared/interfaces';
import { ConnectionApplicationService } from '@shared/services';

/**
 * it will display a selector for remote applications
 */
@Component({
  selector: 'app-selector-remote-applications',
  templateUrl: './selector-remote-applications.component.html',
  styleUrls: ['./selector-remote-applications.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorRemoteApplicationsComponent implements OnInit, OnChanges {
  /**
   * constructor for SelectorRemoteCategoriesComponent
   */
  constructor(
    private _ref: ChangeDetectorRef,
    private _connectionApplicationService: ConnectionApplicationService
  ) {}

  /**
   * list of selected applications
   */
  @Input() readonly selectedApplications: RemoteApplication[] = [];
  /**
   * display prop is used as key of property wanted to be displayed in list
   */
  @Input() readonly displayProp = 'applicationLabel';
  /**
   * searchProps is list of keys which we wanted to do search on those properties
   */
  @Input() readonly searchProps: string[] = ['applicationLabel', 'applicationName'];
  /**
   * it indicates whether the dropdown should be statically open or not
   */
  @Input() readonly staticOpen = true;
  /**
   * this property is an event which gets called when selected group has changed
   */
  @Output() selectedApplicationsChange = new EventEmitter<any[]>();
  /**
   * list of different applications
   */
  applications: any[] = [];
  /**
   * it occurs when an error thrown while fetching data
   */
  hasError = false;
  /**
   * flag for indicating when component is busy with fetching data
   */
  isLoading = false;

  /**
   * it gets called on component initialization
   */
  ngOnInit(): void {
    this._getRemoteApplications();
  }

  /**
   * it gets called on component inputs changed
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedApplications?.currentValue) {
      // TODO: implement this.selectedApplicationsChanged(changes.selectedApplications.currentValue);
      // this.selectedApplications = changes.selectedApplications.currentValue;
    }
  }

  /**
   * it gets called when an item is select/unselect from list
   */
  selectedApplicationsChanged(selectedHosts: any): void {
    this.selectedApplicationsChange.emit(selectedHosts);
  }

  /**
   * it will get list of remote applications
   */
  private _getRemoteApplications(): void {
    this.isLoading = true;
    this._connectionApplicationService
      .getAll()
      .subscribe({
        next: data => {
          this.applications = data;
          this.hasError = false;
        },
        error: err => {
          this.hasError = true;
          console.error('ERROR _getRemoteApplications: ', err);
        },
      })
      .add(() => {
        this.isLoading = false;
        this._ref.markForCheck();
      });
  }
}
