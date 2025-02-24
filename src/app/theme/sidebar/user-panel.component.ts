import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { AuthService } from '@core/authentication';
import { TranslateModule } from '@ngx-translate/core';
import { UserBriefInfo } from '@shared';

@Component({
  selector: 'app-user-panel',
  template: `
    <div class="matero-user-panel" routerLink="/profile/overview">
      <img
        class="matero-user-panel-avatar"
        [src]="user.userImage || 'images/avatar.jpg'"
        alt="avatar"
        width="64"
      />
      <div class="matero-user-panel-info">
        <h4>{{ user.displayName }}</h4>
        <h5>{{ user.username }}</h5>
      </div>
    </div>
  `,
  styleUrl: './user-panel.component.scss',
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatTooltipModule, TranslateModule],
})
export class UserPanelComponent implements OnInit {
  private readonly auth = inject(AuthService);

  user!: UserBriefInfo;

  ngOnInit(): void {
    this.auth.user().subscribe(user => (this.user = user));
  }
}
