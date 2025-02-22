import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { CfxCertificateService } from '../../_services/cfx-certificate.service';
import { CSRCertificate } from '../../_models/CSR-certificate';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KeyWithCustomTemplate, ToastService, TimeService } from '@shared';
import { TranslateService } from '@ngx-translate/core';

/**
 * this component is created to show CSR certificate
 */
@Component({
  selector: 'app-wina-csr',
  templateUrl: './wina-csr.component.html',
  styleUrls: ['./wina-csr.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinaCsrComponent implements OnInit {
  /**
   * to show CSR certificate
   */
  _cSRCertificate: CSRCertificate | undefined;
  /**
   * a flag to show loading on get data
   */
  _isLoading = false;
  /**
   * a flag to show loading on submit file
   */
  _isSubmitFileLoading = false;
  /**
   * to check _cSRCertificate has value
   */
  _isEmpty = true;
  /**
   * key of each row to show
   */
  _keys: KeyWithCustomTemplate[] = [];
  /**
   * for showing alert for each possible error
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * for showing alert for send cer file value to server
   */
  _allPossibleCerFileErrors = new Map<string, string>();
  /**
   * a form to handle upload CER
   */
  _uploadForm: FormGroup | undefined;
  /**
   * count down time
   */
  _remainingCountDownTime = 100;
  /**
   * to handle show or hide count down
   */
  _showCountDown = false;
  /**
   * to open upload file in modal
   */
  @ViewChild('UploadCERFile') private _uploadCERFile: TemplateRef<any> | undefined;

  constructor(
    private _cfxCertificateService: CfxCertificateService,
    private _cdr: ChangeDetectorRef,
    private _toastService: ToastService,
    private _timeService: TimeService,
    private _fb: FormBuilder,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._setKeys();
    this._getCsrCertificate();
  }

  /**
   * an action to complete CSR
   */
  completeCSR() {
    this._uploadForm = this._fb.group({
      certificate: [undefined, [Validators.required]],
    });
    // const modalOptions: ModalOptions = {
    //   submitBtnLabel: this._translatorService.instant('UploadFile'),
    // };
    // this._modalService.showModal(this._uploadCERFile, modalOptions).subscribe(() => {
    //   this._showCountDown = true;
    // });
  }

  /**
   * to submit CER file value to api
   * to complete Certificate
   */
  submitFile() {
    if (this._uploadForm?.invalid) {
      this._uploadForm?.markAllAsTouched();
      return;
    }
    this._isSubmitFileLoading = true;
    //base64 to string
    const convertedValue = atob(this._uploadForm?.get('certificate')?.value.split(',')[1]);
    const model = {
      certificate: convertedValue,
    };
    this._cfxCertificateService
      .completeCSRCertificate(model)
      .subscribe(
        () => {
          // this._modalService.closeActiveModal();
        },
        error => {
          if (error.errors.length) {
            this._allPossibleCerFileErrors.set(error.location, '');
          } else {
            this._allPossibleCerFileErrors.set(
              error.location,
              this._translatorService.instant('AnErrorOccurredDuringUpload_CSRCertificate')
            );
          }
        }
      )
      .add(() => {
        this._isSubmitFileLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * show confirmation to delete CSR
   */
  deleteConfirmationCSR() {
    // const configs: ConfirmationModalConfigs = {
    //   cancelColor: ColorEnum.Warning,
    //   submitLabel: this._translatorService.instant('YesDeleteIt'),
    // };
    // this._confirmationModalService
    //   .openTextual(this._translatorService.instant('AreYouSureYouWantToDelete_CSRCertificate'), configs)
    //   .subscribe(() => {
    //     this._deleteCRS();
    //   });
  }

  /**
   * an action to download CSR
   */
  downLoadCSR(data: string) {
    const blob = new Blob([data], { type: 'text/pkix-cert' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'generateCsr.cer';
    a.click();
  }

  /**
   * an action to copy CSR show message
   */
  copyCSR() {
    this._toastService.open(
      this._translatorService.instant('TheCSRCertificateCopiedSuccessfully'),
      'success'
    );
  }

  /**
   * set new CSR
   */
  setNewCSR(csrCertificate: CSRCertificate): void {
    this._cSRCertificate = csrCertificate;
    this._isEmpty = false;
  }

  /**
   * to call current api on zero time
   * to find wina is on or off
   */
  timeDown() {
    this._timeService.getCurrentTimeFromServer().subscribe(
      () => {
        window.location.reload();
      },
      (err: any) => {
        if (err.errors.length && err.errors[0].code === 500) {
          this._toastService.open(this._translatorService.instant('currentTimeError'), 'error');
        } else {
          this._remainingCountDownTime = this._remainingCountDownTime + 1;
        }
      }
    );
  }

  /**
   * to get csr certificate from server
   */
  private _getCsrCertificate() {
    this._isLoading = true;
    this._cfxCertificateService
      .getCSRCertificate()
      .subscribe(
        (res: CSRCertificate) => {
          this._cSRCertificate = res;
          this._isEmpty = !this._cSRCertificate.csr;
        },
        (error: any) => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('AnErrorOccurredDuringGet_CSRCertificate')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }

  /**
   * an action to set keys of list
   */
  private _setKeys(): void {
    this._keys = [
      {
        key: 'commonName',
        keyToDisplay: this._translatorService.instant('CommonName'),
        customTemplate: undefined,
      },
      {
        key: 'organization',
        keyToDisplay: this._translatorService.instant('organization'),
        customTemplate: undefined,
      },
      {
        key: 'organizationUnit',
        keyToDisplay: this._translatorService.instant('OrganizationUnit'),
        customTemplate: undefined,
      },
      {
        key: 'locality',
        keyToDisplay: this._translatorService.instant('locality'),
        customTemplate: undefined,
      },
      {
        key: 'state',
        keyToDisplay: this._translatorService.instant('state'),
        customTemplate: undefined,
      },
      {
        key: 'emailAddress',
        keyToDisplay: this._translatorService.instant('EmailAddress'),
        customTemplate: undefined,
      },
    ];
  }

  /**
   * an action to delete CSR from server
   */
  private _deleteCRS() {
    this._isLoading = true;
    this._cfxCertificateService
      .deleteCSRCertificate()
      .subscribe({
        next: () => {
          this._cSRCertificate = undefined;
          this._toastService.open(
            this._translatorService.instant('TheCSRCertificateDeleteSuccessfully'),
            'success'
          );
          this._isEmpty = true;
        },
        error: (error: any) => {
          this._allPossibleErrors.set(
            error.location,
            this._translatorService.instant('AnErrorOccurredDuringDelete_CSR_certificate')
          );
        },
      })
      .add(() => {
        this._isLoading = false;
        this._cdr.markForCheck();
      });
  }
}
