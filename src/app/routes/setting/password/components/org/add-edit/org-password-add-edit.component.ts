import { InputRegex } from '@shared/models';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ChangeDetectionStrategy, Component, OnInit, inject, Inject } from '@angular/core';

import { OrganizationalPassword } from '@shared';

@Component({
  selector: 'app-organizational-password-add-edit',
  templateUrl: './org-password-add-edit.component.html',
  styles: `
    :host {
      direction: rtl;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    MatButton,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatCheckbox,
  ],
})
export class OrgPasswordAddEditComponent implements OnInit {
  fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<OrgPasswordAddEditComponent>);
  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: OrganizationalPassword | undefined) {
    this.form = this.fb.group({
      id: [data?.id],
      name: [data?.name, [Validators.required]],
      address: [data?.address, [Validators.required, Validators.pattern(InputRegex.uriPattern)]],
      token: [data?.token],
      readonly: [data?.readonly],
      ssl: [data?.ssl],
      certificate: [{ value: data?.certificate, disabled: true }],
    });
    this.form.controls.ssl.valueChanges.subscribe((value: boolean) => {
      this.onSslChange(value);
    });
  }

  ngOnInit() {
    if (this.form.value.id) {
      this.form.controls.password.clearValidators();
      this.form.controls.repeatPassword.clearValidators();
    }
  }

  onSslChange(value: boolean): void {
    if (value) {
      this.form?.get('certificate')?.setValidators([Validators.required]);
      this.form?.get('certificate')?.enable();
    } else {
      this.form?.get('certificate')?.removeValidators([Validators.required]);
      this.form?.get('certificate')?.disable();
      this.form?.patchValue({ certificate: '' });
    }
    this.form?.get('certificate')?.updateValueAndValidity();
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
