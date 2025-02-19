import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Component, Inject, ViewEncapsulation } from '@angular/core';

/**
 * it would show snackbar material
 */
@Component({
  selector: 'lib-snack-bar',
  standalone: true,
  template: `
    <div class="data">{{ data }}</div>
  `,
  styleUrls: ['./snack-bar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SnackBarComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) {}
}
