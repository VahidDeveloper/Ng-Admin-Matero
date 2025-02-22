import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CSRCertificate } from '../../_models/CSR-certificate';
import { CfxCertificateService } from '../../_services/cfx-certificate.service';
import { ToastService } from '@shared/services';
import { TranslateService } from '@ngx-translate/core';

/**
 * this component is created to add new CSR Certificate
 * if certificate not exist
 */
@Component({
  selector: 'app-add-csr-certificate',
  templateUrl: './add-csr-certificate.component.html',
  styleUrls: ['./add-csr-certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCsrCertificateComponent implements OnInit {
  /** CSR certificate inputs form */
  _form: FormGroup | undefined;
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * loading indicator when submit modal
   */
  _isLoading = false;

  /**
   * pass new CSR to parent
   */
  @Output() createdNewCSR = new EventEmitter<CSRCertificate>();

  constructor(
    private _fb: FormBuilder,
    private _cfxCertificateService: CfxCertificateService,
    private _cdr: ChangeDetectorRef,
    private _toastService: ToastService,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._createFormControl();
  }

  /**
   * to submit form data to api
   */
  submit() {
    if (this._form?.invalid) {
      this._form?.markAllAsTouched();
      return;
    }
    this._isLoading = true;
    this._cfxCertificateService
      .addNewCSRCertificate(this._form?.value)
      .subscribe({
        next: (res: CSRCertificate) => {
          this._toastService.open(
            this._translatorService.instant('CSR_certificateCreateSuccessfully'),
            'success'
          );
          this.createdNewCSR.emit(res);
        },
        error: (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredDuringCreateCSRCertificate')
          );
        },
      })
      .add(() => {
        this._isLoading = false;
        this._cdr.detectChanges();
      });
  }

  /**
   * to create form control
   */
  private _createFormControl(): void {
    this._form = this._fb.group({
      commonName: [null, [Validators.required]],
      organizationUnit: [null],
      organization: [null],
      locality: [null],
      state: [null],
      country: [null, [Validators.maxLength(2)]],
      emailAddress: [null, [Validators.email]],
    });
  }
}
