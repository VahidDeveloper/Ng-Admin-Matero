import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NgIf } from '@angular/common';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { isArray, TranslatePipe } from '@ngx-translate/core';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';

import { CommandSetting } from '@shared/interfaces';

/**
 * this component is created for add or edit command
 */
@Component({
  templateUrl: './add-edit-command.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatError,
    MatFormField,
    MatInput,
    MatLabel,
    NgIf,
    ReactiveFormsModule,
    TranslatePipe,
  ],
})
export class AddEditCommandComponent {
  fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<AddEditCommandComponent>);
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: CommandSetting | undefined) {
    this.form = this.fb.group({
      id: [data?.id],
      name: [data?.name, Validators.required],
      commands: [data?.commands, Validators.required],
      description: [data?.description],
    });
  }

  closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }

  /**
   * this method is created for submit form
   */
  submitForm() {
    if (this.form?.invalid) {
      this.form?.markAllAsTouched();
      return;
    }
    if (!isArray(this.form.value.commands)) {
      this.form.controls.commands.patchValue([this.form.value.commands]);
    }
    this.dialogRef.close(this.form.value); // Pass updated project back to the component
  }
}
