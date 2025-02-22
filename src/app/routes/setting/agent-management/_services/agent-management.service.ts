import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Agent } from '../_models/agent';
import { GenericCrudService, WinaRestUrls } from '@shared';

/**
 * a class to manage agent actions
 */
@Injectable({
  providedIn: 'root',
})
export class AgentManagementService extends GenericCrudService<Agent> {
  constructor(protected _http: HttpClient) {
    super(_http, WinaRestUrls.remoteMachineAgent());
  }

  /**
   * get all agents filter per register or unRegister
   */
  getAgentList(registered: boolean): Observable<Agent[]> {
    return super.getAll().pipe(map(data => data.filter(agent => agent.registered === registered)));
  }

  /**
   * assign agent to remote machine
   */
  assignAgentToRemoteMachine(agent: Partial<Agent>): Observable<Agent> {
    return this._http.put<Agent>(WinaRestUrls.remoteMachineAgentRegister(), agent);
  }

  /**
   * un assign agent to remote machine
   */
  unAssignAgentToRemoteMachine(body: { guid: number }): Observable<Agent> {
    return this._http.put<Agent>(WinaRestUrls.remoteMachineAgentUnregister(), body);
  }
}
