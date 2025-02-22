import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@shared/components';
import { TranslateService } from '@ngx-translate/core';
/**
 * this component is created to show assign and un assign agents in remote machines
 */
@Component({
  selector: 'app-agent-management',
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterModule, BreadcrumbComponent],
})
export class AgentManagementComponent implements OnInit {
  items: any = [
    {
      title: this._translatorService.instant('DISCONNECT_AGENT_MENU'),
      icon: 'icon-Sign-out-00',
      click: () => {
        this._router.navigate(['unAssign-agents'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('DisConnectedAgentsInfo'),
    },
    {
      title: this._translatorService.instant('CONNECT_AGENT_MENU'),
      icon: 'icon-Sign-out-00',
      click: () => {
        this._router.navigate(['assign-agents'], { relativeTo: this._activatedRoute }).then();
      },
      description: this._translatorService.instant('ConnectedAgentsInfo'),
    },
  ];

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    const path = this._router.routerState.snapshot.url.split('/').pop()!;
    this.activeCurrentMenu(path);
  }

  /** it set active to current route */
  activeCurrentMenu(path: string): void {
    switch (path) {
      case 'unAssign-agents':
        this.items[0].active = true;
        break;
      case 'assign-agents':
        this.items[1].active = true;
        break;
    }
  }
}
