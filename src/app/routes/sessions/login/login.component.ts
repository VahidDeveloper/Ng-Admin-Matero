import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { MtxButtonModule } from '@ng-matero/extensions/button';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { AuthService } from '@core/authentication';
import { ErrorDisplay } from '@shared/models';
import { ToastService } from '@shared/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MtxButtonModule,
    TranslateModule,
  ],
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  isSubmitting = false;

  loginForm = this.fb.nonNullable.group({
    username: ['adminwina', [Validators.required]],
    password: ['123456A!', [Validators.required]],
    rememberMe: [false],
  });

  get username() {
    return this.loginForm.get('username')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  get rememberMe() {
    return this.loginForm.get('rememberMe')!;
  }

  login() {
    this.isSubmitting = true;

    this.auth
      .login(this.username.value, this.password.value)
      .pipe(filter(authenticated => authenticated))
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (errorRes: ErrorDisplay) => {
          console.log(errorRes);
          if (errorRes.status === 'ERROR') {
            const form = this.loginForm;
            const error = errorRes.errors && errorRes.errors[0]!;
            this.toast.open(error?.error?.description ?? '', 'error');
          }
          this.isSubmitting = false;
        },
      });
  }
}
