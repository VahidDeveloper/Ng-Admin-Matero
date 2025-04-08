import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton, MatFabButton, MatIconButton } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OnInit, Component, ChangeDetectionStrategy, inject, signal, Inject } from '@angular/core';

import { InputRegex } from '@shared/models';
import { LdapStore } from '../../services/store.service';
import { IdentityErrorComponent } from '@shared/components';
import { LdapServerModel } from '../../types/ldap-server-model';

/** a component for add new ldap server or update them */
@Component({
  templateUrl: './add-edit-ldap.component.html',
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
    MatButton,
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    IdentityErrorComponent,
    MatIconButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEditLdapComponent implements OnInit {
  store = this.data.store;
  value = this.data.value;
  fb = inject(FormBuilder);
  form: FormGroup;
  list$: Observable<string[]> | undefined = of([]);
  submitLoading$: Observable<boolean> = of(false);
  testEmailLoading = signal(false);

  _certificateInfo: Readonly<Record<string, string>> | undefined;
  /** previous certificate information which has to be gotten from server */
  _previousCertificate: Record<string, string> = {};

  readonly dialogRef = inject(MatDialogRef<AddEditLdapComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { value: LdapServerModel | undefined; store: LdapStore }
  ) {
    this.form = this.fb.group({
      id: [data.value?.id],
      name: [data.value?.name, [Validators.required]],
      address: [
        data.value?.address,
        [Validators.required, Validators.pattern(InputRegex.ipVsHostname)],
      ],
      port: [data.value?.port],
      baseDn: [data.value?.baseDn, Validators.required],
      password: [data.value?.password, Validators.required],
      userDn: [data.value?.userDn, Validators.required],
      activeDirectory: [data.value?.activeDirectory],
      tls: [data.value?.tls],
      ignoreCert: [data.value?.ignoreCert],
      certificate: [null],
      acceptCert: [null],
    });
    this.submitLoading$ = this.store?.select(state => state.postLoading);
  }

  ngOnInit(): void {}

  /** fire when test connection button clicked and test ldap server connection */
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

  /** it called before save any ldap servers and test connection */
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

  /** accept certification when saving ldap server */
  _acceptCertificate(): void {
    if (this._certificateInfo) {
      this.form.controls.acceptCert.patchValue(true);
      this.form.controls.certificate.patchValue(this._certificateInfo);
    }
  }

  /** it call when user accept certification */
  private _resetCertControls(): void {
    this.form.controls.acceptCert.patchValue(null);
    this.form.controls.certificate.patchValue(null);
  }

  /** patch ldap model to form in edit mod */
  private _patchLdapModelToForm(model: LdapServerModel): void {
    this.form.controls.password.clearValidators();
    this.form.patchValue(model);
  }
}
