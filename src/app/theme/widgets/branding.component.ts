import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-branding',
  imports: [TranslatePipe],
  template: `
    <a class="branding" href="/">
      <img src="images/wina-logo.png" class="branding-logo" alt="logo" />
      @if (showName) {
        <span class="branding-name">{{ 'wina' | translate }}</span>
      }
    </a>
  `,
  styles: `
    .branding {
      display: flex;
      align-items: center;
      margin: 0 0.5rem;
      text-decoration: none;
      white-space: nowrap;
      color: inherit;
      border-radius: 50rem;
    }

    .branding-logo {
      width: 2rem;
      height: 2rem;
    }

    .branding-name {
      margin: 0 0.5rem;
      font-size: 1rem;
      font-weight: 500;
    }
  `,
})
export class BrandingComponent {
  @Input() showName = true;
}
