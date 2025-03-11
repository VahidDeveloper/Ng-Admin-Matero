import { FormsModule } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { BreadcrumbComponent } from '@shared/components';

@Component({
  selector: 'app-slide-toggle',
  templateUrl: './slide-toggle.component.html',
  styleUrl: './slide-toggle.component.scss',
  imports: [FormsModule, MatCardModule, MatSlideToggleModule, MatButtonModule, BreadcrumbComponent],
})
export class SlideToggleComponent {
  private snackBar = inject(MatSnackBar);

  emailToggle = true;
  termsToggle = false;
  musicToggle = false;

  onFormSubmit() {
    this.snackBar.open('Terms and conditions accepted!', '', { duration: 2000 });
  }
}
