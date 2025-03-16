import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatSelect } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/autocomplete';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Component, OnInit, inject, Inject, signal } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { MatButtonToggle, MatButtonToggleGroup } from '@angular/material/button-toggle';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { InputRegex } from '@shared/models';
import { SyslogServerModel } from '../../types/type';
import { SyslogStore } from '../../services/store.service';
import { IdentityErrorComponent } from '@shared/components';

@Component({
  templateUrl: './add-edit-syslog.component.html',
  styles: `
    :host {
      direction: rtl;
    }
  `,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatCheckbox,
    MatOption,
    MatSelect,
    MatButtonToggle,
    MatButtonToggleGroup,
    MatButton,
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    IdentityErrorComponent,
    MatIconButton,
  ],
})
export class AddEditSyslogComponent implements OnInit {
  store = this.data.store;
  value = this.data.value;
  fb = inject(FormBuilder);
  form: FormGroup;
  list$: Observable<string[]> | undefined = of([]);
  submitLoading$: Observable<boolean> = of(false);
  testEmailLoading = signal(false);
  logTypes = ['RFC5424', 'RFC3164', 'RFC5425'];

  _certificateInfo: Readonly<Record<string, string>> | undefined;
  /** previous certificate information which has to be gotten from server */
  _previousCertificate: Record<string, string> = {};

  readonly dialogRef = inject(MatDialogRef<AddEditSyslogComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { value: SyslogServerModel | undefined; store: SyslogStore }
  ) {
    this.form = this.fb.group({
      id: [data.value?.id],
      address: [
        data.value?.address,
        [Validators.required, Validators.pattern(InputRegex.ipVsHostname)],
      ],
      port: [data.value?.port, Validators.required],
      protocol: [data.value?.protocol || 'udp', Validators.required],
      syslogRfc: [data.value?.syslogRfc, Validators.required],
      subCategories: [data.value?.subCategories],
      ssl: [data.value?.ssl],
      ignoreCert: [data.value?.ignoreCert],
      acceptCert: [data.value?.acceptCert],
      certificate: [data.value?.certificate],
    });

    this.list$ = this.store?.select(state => state.categories);
    this.submitLoading$ = this.store?.select(state => state.postLoading);
  }

  ngOnInit() {
    if (this.form.value.id) {
      this.form.controls.password.clearValidators();
      this.form.controls.repeatPassword.clearValidators();
    }
  }

  _testConnection(): void {
    if (this.form.valid) {
      this.testEmailLoading.set(true);
      this.store
        .testServerAvailability(this.form.value)
        .add(() => this.testEmailLoading.set(false));
    } else {
      this.form.markAllAsTouched();
    }
  }

  _tryTestConnection(): void {
    this.form.controls.acceptCert.patchValue(true);
    this.form.controls.certificate.patchValue(this._certificateInfo);
    this._testConnection();
  }

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    delete this.form.value.repeatPassword;
    this.store.upsertServer(this.form.value); // Pass updated project back to the component
  }
}
