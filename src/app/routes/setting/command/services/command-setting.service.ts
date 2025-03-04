import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommandSettingModel } from '@shared/interfaces';
import { WinaRestUrls } from '@shared/models';

/**
 * this service is created for operations of command-groups.
 */
@Injectable({
  providedIn: 'root',
})
export class CommandSettingService {
  constructor(private _http: HttpClient) {}

  /** get all commands */
  getCommandList(): Observable<CommandSettingModel[]> {
    return this._http.get<CommandSettingModel[]>(WinaRestUrls.getCommands(), {});
  }

  /** delete selected command */
  deleteCommand(id: number) {
    return this._http.post(WinaRestUrls.deleteCommand(), [{ templateIds: id }]);
  }

  /** update selected command*/
  addOrEditCommand(model: CommandSettingModel): Observable<CommandSettingModel> {
    return this._http.post<CommandSettingModel>(WinaRestUrls.addOrEditCommand(), model);
  }
}
