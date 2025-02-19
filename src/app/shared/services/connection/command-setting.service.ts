import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommandSettingModel, TemplateId } from '@shared/interfaces';
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
  deleteCommand(templateIds: TemplateId[]): Observable<TemplateId> {
    return this._http.post<TemplateId>(WinaRestUrls.deleteCommand(), templateIds);
  }

  /** update selected command*/
  addOrEditCommand(model: CommandSettingModel): Observable<CommandSettingModel> {
    return this._http.post<CommandSettingModel>(WinaRestUrls.addOrEditCommand(), model);
  }
}
