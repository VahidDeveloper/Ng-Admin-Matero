import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';

import { BreadcrumbComponent } from '@shared/components';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
  imports: [BreadcrumbComponent, MatCardModule, MatButtonModule],
})
export class CardComponent {
  private snackBar = inject(MatSnackBar);

  showProgress = false;

  openSnackbar(message: string) {
    this.snackBar.open(message, '', { duration: 2000 });
  }
}
