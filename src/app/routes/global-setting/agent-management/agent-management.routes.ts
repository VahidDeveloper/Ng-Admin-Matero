import { Routes } from '@angular/router';
import { AgentManagementComponent } from './agent-management.component';
import { AgentListComponent } from './agent-list/agent-list.component';

export const routes: Routes = [
  {
    path: '',
    component: AgentManagementComponent,
    children: [
      { path: 'unAssign-agents', component: AgentListComponent },
      { path: 'assign-agents', component: AgentListComponent },
      {
        path: '',
        redirectTo: 'unAssign-agents',
        pathMatch: 'full',
      },
    ],
  },
];
