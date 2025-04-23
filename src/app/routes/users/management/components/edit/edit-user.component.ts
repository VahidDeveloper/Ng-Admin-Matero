import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { MatFabButton } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { OnInit, Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCard, MatCardContent } from '@angular/material/card';

/** a component for add new ldap server or update them */
@Component({
  templateUrl: './edit-user.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslatePipe,
    MatInputModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatFabButton,
    MatIcon,
    MatProgressSpinner,
    MatCard,
    MatCardContent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditUserComponent implements OnInit {
  fb = inject(FormBuilder);
  form: FormGroup;
  submitLoading$: Observable<boolean> = of(false);

  constructor() {
    this.form = this.fb.group({
      username: [null, [Validators.required]],
      firstname: [null, Validators.required],
      lastname: [null, [Validators.required]],
      email: [null, Validators.required],
      password: [null, Validators.required],
      repeatPassword: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  submitForm(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
  }
}
