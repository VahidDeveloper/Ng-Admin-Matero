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
import { RemoteCategory } from '@shared/interfaces';
import { RemoteMachineCategoriesService } from '@shared/services';

/**
 * it will display a selector for remote categories
 */
@Component({
  selector: 'app-selector-remote-categories',
  templateUrl: './selector-remote-categories.component.html',
  styleUrls: ['./selector-remote-categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectorRemoteCategoriesComponent implements OnInit, OnChanges {
  /**
   * constructor for SelectorRemoteCategoriesComponent
   */
  constructor(
    private _ref: ChangeDetectorRef,
    private _remoteMachineCategoriesService: RemoteMachineCategoriesService
  ) {}

  /**
   * list of selected categories
   */
  @Input() selectedCategories: RemoteCategory[] = [];
  /**
   * it indicates whether the dropdown should be statically open or not
   */
  @Input() readonly staticOpen = true;
  /**
   * this property is an event which gets called when selected group has changed
   */
  @Output() selectedCategoriesChange = new EventEmitter<any[]>();
  /**
   * list of different categories
   */
  categories: any[] = [];
  /**
   * it occurs when an error thrown while fetching data
   */
  hasError = false;
  /**
   * flag for indicating when component is busy with fetching data
   */
  isLoading = false;
  /**
   * display prop is used as key of property wanted to be displayed in list
   */
  displayProp = 'name';
  /**
   * key prop is use as a key to do some actions
   */
  keyProp = 'id';
  /**
   * searchProps is list of keys which we wanted to do search on those properties
   */
  searchProps: string[] = ['name'];

  /**
   * it gets called on component initialization
   */
  ngOnInit(): void {
    this._getRemoteCategories();
  }

  /**
   * it gets called on component inputs changed
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedCategories?.currentValue) {
      this.selectedCategories = changes.selectedCategories.currentValue;
      this._ref.markForCheck();
    }
  }

  /**
   * it gets called when an item is select/unselect from list
   */
  selectedCategoriesChanged(selectedCategories: any): void {
    this.selectedCategoriesChange.emit(selectedCategories);
  }

  /**
   * it will get list of remote categories
   */
  private _getRemoteCategories(): void {
    this.isLoading = true;
    this._remoteMachineCategoriesService
      .getRemoteCategories()
      .subscribe({
        next: data => {
          this.categories = data;
          this.hasError = false;
        },
        error: err => {
          this.hasError = true;
          console.error('ERROR _getRemoteCategories: ', err);
        },
      })
      .add(() => {
        this.isLoading = false;
        this._ref.markForCheck();
      });
  }
}
