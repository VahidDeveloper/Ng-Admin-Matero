import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatFabButton, MatIconButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { OnInit, Component, ChangeDetectionStrategy, inject, Inject } from '@angular/core';

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
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    MatIconButton,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddUserComponent implements OnInit {
  store = this.data.store;
  fb = inject(FormBuilder);
  form: FormGroup;
  submitLoading$: Observable<boolean> = of(false);

  readonly dialogRef = inject(MatDialogRef<AddUserComponent>);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { store: UserStore }
  ) {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      firstname: [null, [Validators.required]],
      lastname: [null, [Validators.required]],
      email: [null, Validators.required],
      password: [null, Validators.required],
      repeatPassword: [null, Validators.required],
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
    this.store.upsertUser(this.form.value); // Pass updated project back to the component
  }
}
