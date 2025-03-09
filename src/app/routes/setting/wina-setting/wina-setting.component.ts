import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/** a component for set system global settings */
@Component({
  selector: 'wina-setting',
  template: `
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet],
})
export class WinaSettingComponent {
  constructor() {}
}
