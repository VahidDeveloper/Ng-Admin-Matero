import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { RemoteApplication } from '@shared/interfaces';
import { WinaRestUrls } from '@shared/models';

/**
 * it will display list of remote applications in grid mode
 */
@Component({
  selector: 'app-application-list-grid',
  templateUrl: './remote-application-list-grid.component.html',
  styleUrls: ['./remote-application-list-grid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTooltipModule, TranslatePipe],
})
export class RemoteApplicationListGridComponent {
  /**
   * list of remote applications
   */
  @Input() list: readonly RemoteApplication[] | undefined;
  /**
   * its a flag which indicates whether the items are readonly or not
   */
  @Input() readonly isReadonly = false;
  /**
   * an event which is shouted when an item wanted to be removed from list
   */
  @Output() remove = new EventEmitter<number>();
  /**
   * an event which is shouted when an item wanted to be edited from list
   */
  @Output() edit = new EventEmitter<number>();
  /**
   * an event which is shouted when an item wanted to be edited from list
   */
  @Output() selected = new EventEmitter<RemoteApplication>();
  /**
   * base of image
   */
  readonly imageBaseUrl = WinaRestUrls.imageBaseURL();

  /**
   * it gets called on remove clicked
   */
  onRemove(index: number): void {
    this.remove.emit(index);
  }

  /**
   * it gets called on edit clicked
   */
  onEdit(index: number): void {
    this.edit.emit(index);
  }

  /**
   * it gets called on app clicked (just in readonly mode)
   */
  onSelect(application: RemoteApplication): void {
    if (this.isReadonly) {
      this.selected.emit(application);
    }
  }
}
