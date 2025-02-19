import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SnackBarComponent } from '@shared/components';

/** this service is used to handle need of managing all toasts from a higher order class */
@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  /** toast used for success messages. */

  open(text: string, color: string): void {
    this._openSnackBar(text, color);
  }

  /**
   * to show message in material snackbar
   * @param message
   * @param color
   * @private
   */
  private _openSnackBar(message: string, color: string) {
    this.snackBar.openFromComponent(SnackBarComponent, {
      data: message,
      duration: 5000,
      panelClass: ['custom-snackbar', `snackbar-${color}`],
    });
  }
}
