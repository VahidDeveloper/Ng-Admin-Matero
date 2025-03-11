import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { WinaRestUrls } from '@shared/models';
import { CommandSetting } from '@shared/interfaces';

/**
 * this service is created for operations of command-groups.
 */
@Injectable({
  providedIn: 'root',
})
export class CommandSettingService {
  constructor(private _http: HttpClient) {}

  /** get all commands */
  getCommandList(): Observable<CommandSetting[]> {
    return this._http.get<CommandSetting[]>(WinaRestUrls.getCommands(), {});
  }

  /** delete selected command */
  deleteCommand(id: number) {
    return this._http.post(WinaRestUrls.deleteCommand(), [{ templateIds: id }]);
  }

  /** update selected command*/
  addOrEditCommand(model: CommandSetting): Observable<CommandSetting> {
    return this._http.post<CommandSetting>(WinaRestUrls.addOrEditCommand(), model);
  }
}
