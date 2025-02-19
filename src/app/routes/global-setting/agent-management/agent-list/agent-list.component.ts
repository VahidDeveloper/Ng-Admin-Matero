import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Agent } from '../_models/agent';
import { AgentManagementService } from '../_services/agent-management.service';
import {
  FilterRemoteMachines,
  UserRole,
  WinaUserIdentityService,
  ToastService,
  RemoteMachineExtended,
  CommonTableCellClass,
} from '@shared';
import { TranslateService } from '@ngx-translate/core';

/**
 * this component is created to show all agents
 */
@Component({
  selector: 'app-agent-list',
  templateUrl: './agent-list.component.html',
  styleUrls: ['./agent-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgentListComponent implements OnInit {
  /**
   * list of agents
   */
  rows: Agent[] = [];
  /**
   *columns data needed for data-table
   */
  columns: any[] = [];
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * for showing alert for each possible error on assign or unAssign agent to remote errors
   * the keys will be gotten from service
   */
  _allPossibleAssignErrors = new Map<string, string>();
  /**
   * a flag for indicating when component is busy with fetching data
   */
  _isLoading = false;
  /**
   * a flag for indicating when component is busy with post data
   */
  _assignLoading: boolean | undefined;
  /**
   * to show error message if remote machine is not selected in modal
   */
  _errorMessage: string | undefined;
  /**
   * title of card to per page route
   */
  _title: string | undefined;

  _isRegister: boolean | undefined;
  /**
   * to filter remote machines in modal
   */
  _filterRemoteMachines = new FilterRemoteMachines();

  /**
   * template to show agent is register or not register
   */
  @ViewChild('registerAgent', { static: true })
  private _registered: TemplateRef<any> | undefined;
  /**
   * template to show modal for assign or unAssign agent to remote machine
   */
  @ViewChild('assignOrUnAssignTemplate', { static: true })
  private _assignOrUnAssignTemplate: TemplateRef<any> | undefined;
  /**
   * to use selected table row agent
   */
  private _selectedAgentRow: Agent | undefined;

  constructor(
    private _agentManagementService: AgentManagementService,
    private _userIdentityService: WinaUserIdentityService,
    private _activatedRoute: ActivatedRoute,
    private _toastService: ToastService,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._isRegister = this._activatedRoute.snapshot.routeConfig?.path === 'assign-agents';
    this._setColumns();
    this._setCardTitle();
    this._getAllAgent();
  }

  /**
   * reload agent list
   */
  reloadList() {
    this._getAllAgent();
  }

  /**
   * to connect selected remote machine to agent
   */
  assignAgentToRemoteMachines(selected: RemoteMachineExtended[]): void {
    if (!selected.length) {
      this._errorMessage = this._translatorService.instant('PleaseSelectRemoteMachine');
      return;
    }
    const agent = {} as Agent;
    agent.guid = this._selectedAgentRow?.guid;
    agent.hostId = selected[0].id!;
    this._assignAgentToRemoteMachine(agent);
  }

  /**
   * to show card title
   */
  private _setCardTitle(): void {
    this._title = this._isRegister
      ? this._translatorService.instant('CONNECT_AGENT_MENU')
      : this._translatorService.instant('DISCONNECT_AGENT_MENU');
  }

  /**
   * this method created to get all  agents
   */
  private _getAllAgent(): void {
    this._isLoading = true;
    this._agentManagementService
      .getAgentList(this._isRegister!)
      .subscribe(
        (res: Agent[]) => {
          this.rows = [...res];
        },
        (error: any) => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('AnErrorOccurredWhileGettingAgentList')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * set columns data needed for data-table
   */
  private _setColumns(): void {
    this.columns = [
      {
        sortable: true,
        prop: 'computerName',
        name: this._translatorService.instant('ComputerName'),
        cellClass: [CommonTableCellClass.OneRowCell, CommonTableCellClass.LtrCell].join(' '),
      },
      {
        sortable: true,
        prop: 'os',
        name: this._translatorService.instant('OS'),
        cellClass: [CommonTableCellClass.OneRowCell, CommonTableCellClass.LtrCell].join(' '),
      },
      {
        prop: 'clientVersion',
        name: this._translatorService.instant('ClientVersion'),
        cellClass: [CommonTableCellClass.OneRowCell, CommonTableCellClass.LtrCell].join(' '),
      },
      {
        prop: 'registered',
        name: this._translatorService.instant('Status'),
        cellTemplate: this._registered,
        cellClass: [CommonTableCellClass.OneRowCell, CommonTableCellClass.LtrCell].join(' '),
      },
    ];
  }

  /**
   * assign agent to remote machine send to api
   */
  private _assignAgentToRemoteMachine(agent: Agent) {
    this._assignLoading = true;
    this._agentManagementService
      .assignAgentToRemoteMachine(agent)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('TheAgentConnectedToRemoteMachine'),
            'success'
          );
          this._getAllAgent();
        },
        (error: any) => {
          this._allPossibleAssignErrors.set(
            error.location,
            this._translatorService.instant('TheAgentConnectedToRemoteMachineError')
          );
        }
      )
      .add(() => {
        this._assignLoading = false;
        this._cdr.detectChanges();
      });
  }

  /**
   * unAssign agent to remote machine send to api
   */
  private _unAssignAgentToRemoteMachine(agent: { guid: number }) {
    this._isLoading = true;
    this._agentManagementService
      .unAssignAgentToRemoteMachine(agent)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('TheAgentDisconnectedFromRemoteMachine'),
            'success'
          );
          this._getAllAgent();
        },
        (error: any) => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('TheAgentDisconnectedFromRemoteMachineError')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.detectChanges();
      });
  }
}
