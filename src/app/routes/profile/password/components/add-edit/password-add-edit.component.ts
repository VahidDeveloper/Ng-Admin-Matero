import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { FormValidators, StoredPassword } from '@shared';
import { MatButton } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-password-add-edit',
  templateUrl: './password-add-edit.component.html',
  styles: `
    :host {
      direction: rtl;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
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
export class PasswordAddEditComponent implements OnInit {
  fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<PasswordAddEditComponent>);
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: StoredPassword | undefined) {
    this.form = this.fb.group({
      id: [data?.id],
      username: [data?.username, Validators.required],
      password: [null, [Validators.required, FormValidators._passwordsEquality('repeatPassword')]],
      repeatPassword: [null, [Validators.required, FormValidators._passwordsEquality('password')]],
      domain: [data?.domain],
      identifierKey: [data?.identifierKey],
    });
  }

  ngOnInit() {
    if (this.form.value.id) {
      this.form.controls.password.clearValidators();
      this.form.controls.repeatPassword.clearValidators();
    }
  }

  closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    delete this.form.value.repeatPassword;
    this.dialogRef.close(this.form.value); // Pass updated project back to the component
  }
}
