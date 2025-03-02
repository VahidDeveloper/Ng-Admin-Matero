import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CertificateStore } from '../../../services/certificate-store.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-add-ca',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    TranslatePipe,
  ],
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
})
export class AddCAComponent {
  fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<AddCAComponent>);

  certificateForm: FormGroup;

  constructor() {
    this.certificateForm = this.fb.group({
      name: ['', Validators.required],
      certificate: ['', Validators.required],
    });
  }

  closeDialog(result: boolean) {
    this.dialogRef.close(result);
  }

  submitForm() {
    if (this.certificateForm.valid) {
      this.dialogRef.close(this.certificateForm.value); // Pass updated project back to the component
    }
  }
}
