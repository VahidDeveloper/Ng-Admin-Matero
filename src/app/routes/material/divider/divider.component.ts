import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';

import { BreadcrumbComponent } from '@shared/components';

@Component({
  selector: 'app-divider',
  templateUrl: './divider.component.html',
  styleUrl: './divider.component.scss',
  imports: [BreadcrumbComponent, MatCardModule, MatListModule, MatDividerModule],
})
export class DividerComponent {}
