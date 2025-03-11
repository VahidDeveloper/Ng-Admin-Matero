import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

import { PageHeaderComponent } from '@shared/components';

@Component({
  selector: 'app-utilities-css-grid',
  templateUrl: './css-grid.component.html',
  styleUrl: './css-grid.component.scss',
  imports: [RouterLink, MatCardModule, PageHeaderComponent],
})
export class UtilitiesCssGridComponent {}
