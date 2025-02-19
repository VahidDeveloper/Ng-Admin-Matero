import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbComponent } from '@shared/components';

/** a component for set system global settings */
@Component({
  selector: 'app-global-setting',
  template: `
    <router-outlet><breadcrumb /></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, BreadcrumbComponent],
})
export class GlobalSettingComponent {
  constructor(private tr: TranslateService) {}
}
