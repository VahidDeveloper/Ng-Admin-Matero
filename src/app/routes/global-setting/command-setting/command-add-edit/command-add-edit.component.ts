import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommandSettingModel, CommandSettingService, ToastService } from '@shared';

/**
 * this component is created for add or edit command
 */
@Component({
  selector: 'app-command-add-edit',
  templateUrl: './command-add-edit.component.html',
  styleUrls: ['./command-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommandAddEditComponent implements OnChanges {
  /**
   * selected command from command list
   */
  @Input() selectedCommand: CommandSettingModel | undefined;
  /**
   * loading
   */
  _isLoading: boolean | undefined;
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors: Record<string, string> = {};
  _form: FormGroup | undefined;

  constructor(
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _commandService: CommandSettingService,
    private _toastService: ToastService,
    private _translatorService: TranslateService
  ) {
    this._addFormControls();
  }

  /**
   * if is changed selectedCommand
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedCommand.currentValue !== changes.selectedCommand.previousValue) {
      this._form?.patchValue(changes.selectedCommand.currentValue);
    }
  }

  /**
   * this method is created for add form controls
   */
  private _addFormControls() {
    this._form = this._fb.group({
      name: [null, Validators.required],
      description: [null],
      commands: [null, Validators.required],
      id: [null],
    });
  }

  /**
   * this method is created for submit form
   */
  submitForm() {
    if (this._form?.invalid) {
      this._form?.markAllAsTouched();
      return;
    }
    this._form?.value.id
      ? this._updateCommand(this._form?.value)
      : this._addNewCommand(this._form?.value);
  }

  /**
   * it will add new command
   */
  private _addNewCommand(command: CommandSettingModel): void {
    this._isLoading = true;
    this._commandService
      .addOrEditCommand(command)
      .subscribe(
        (res: CommandSettingModel) => {
          this._toastService.open(
            this._translatorService.instant('newCommandAddedSuccessfully'),
            'success'
          );
          // this._modalService.closeActiveModal(res);
        },
        (error: any) => {
          this._allPossibleErrors[error.location] = this._translatorService.instant(
            'AnErrorOccurredDuringWhenAddNewCommand'
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * it will update selected command
   */
  private _updateCommand(command: CommandSettingModel): void {
    this._isLoading = true;
    this._commandService
      .addOrEditCommand(command)
      .subscribe(
        (res: CommandSettingModel) => {
          this._toastService.open(
            this._translatorService.instant('selectedCommandUpdateSuccessfully'),
            'success'
          );
          // this._modalService.closeActiveModal(res);
        },
        error => {
          this._allPossibleErrors[error.location] = this._translatorService.instant(
            'AnErrorOccurredDuringWhenUpdateCommand'
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }
}
