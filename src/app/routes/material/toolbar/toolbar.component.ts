import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

import { BreadcrumbComponent } from '@shared/components';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
  imports: [BreadcrumbComponent, MatToolbarModule, MatCardModule, MatButtonModule, MatIconModule],
})
export class ToolbarComponent {}
