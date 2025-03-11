import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { BreadcrumbComponent } from '@shared/components';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  imports: [BreadcrumbComponent, MatButtonModule, MatCardModule, RouterLink],
})
export class SidenavComponent {}
