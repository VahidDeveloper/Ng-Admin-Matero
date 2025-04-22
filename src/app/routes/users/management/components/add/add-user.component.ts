import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OnInit, Component, ChangeDetectionStrategy, inject, Inject } from '@angular/core';

import { UserEntity } from '../../types/user';
import { UserStore } from '../../services/store.service';

/** a component for add new ldap server or update them */
@Component({
  templateUrl: './add-user.component.html',
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
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    MatIconButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent implements OnInit {
  store = this.data.store;
  value = this.data.value;
  fb = inject(FormBuilder);
  form: FormGroup;
  submitLoading$: Observable<boolean> = of(false);

  readonly dialogRef = inject(MatDialogRef<AddUserComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { value: UserEntity | undefined; store: UserStore }
  ) {
    this.form = this.fb.group({
      username: [data.value?.username, [Validators.required]],
      firstname: [data.value?.firstName, [Validators.required]],
      lastname: [data.value?.lastName, [Validators.required]],
      password: [data.value?.password],
      repeatPassword: [data.value?.repeatPassword],
      email: [data.value?.email, Validators.required],
      mobile: [data.value?.mobile],
      homePhone: [data.value?.homePhone],
      pager: [data.value?.pager],
      homeAddress: [data.value?.homeAddress],
      company: [data.value?.company],
      department: [data.value?.department],
      jobTitle: [data.value?.jobTitle],
      employeeId: [data.value?.employeeId],
      fax: [data.value?.fax],
      officeAddress: [data.value?.officeAddress],
    });
    this.submitLoading$ = this.store?.select(state => state.postLoading);
  }

  ngOnInit(): void {}

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    delete this.form.value.repeatPassword;
    this.store.upsertServer(this.form.value); // Pass updated project back to the component
  }
}
