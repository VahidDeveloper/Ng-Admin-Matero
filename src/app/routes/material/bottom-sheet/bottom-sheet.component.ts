import {
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatLineModule, MatOptionModule } from '@angular/material/core';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';

import { BreadcrumbComponent } from '@shared/components';

const defaultConfig = new MatBottomSheetConfig();

@Component({
  selector: 'app-bottom-sheet',
  templateUrl: './bottom-sheet.component.html',
  styleUrl: './bottom-sheet.component.scss',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
    MatLineModule,
    MatOptionModule,
    MatSelectModule,
    BreadcrumbComponent,
  ],
})
export class BottomSheetComponent {
  private _bottomSheet = inject(MatBottomSheet);

  config: MatBottomSheetConfig = {
    hasBackdrop: defaultConfig.hasBackdrop,
    disableClose: defaultConfig.disableClose,
    backdropClass: defaultConfig.backdropClass,
    direction: 'ltr',
    ariaLabel: 'Example bottom sheet',
  };

  @ViewChild(TemplateRef) template!: TemplateRef<any>;

  openComponent() {
    this._bottomSheet.open(BottomSheetOverviewComponent, this.config);
  }

  openTemplate() {
    this._bottomSheet.open(this.template, this.config);
  }
}

@Component({
  selector: 'bottom-sheet-overview-example-sheet',
  template: `
    <mat-nav-list>
      @for (action of [1, 2, 3]; track action) {
        <a href="#" mat-list-item (click)="handleClick($event)">
          <span matListItemTitle>Action {{ action }}</span>
          <span matListItemLine>Description</span>
        </a>
      }
    </mat-nav-list>
  `,
  imports: [MatListModule],
})
export class BottomSheetOverviewComponent {
  private _bottomSheet = inject(MatBottomSheetRef);

  handleClick(event: MouseEvent) {
    event.preventDefault();
    this._bottomSheet.dismiss();
  }
}
