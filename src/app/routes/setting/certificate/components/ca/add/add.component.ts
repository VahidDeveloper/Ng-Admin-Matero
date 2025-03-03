import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-ca',
  templateUrl: './add.component.html',
  styleUrl: './add.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatDialogModule,
    TranslatePipe,
  ],
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
