import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService, TimeService } from '@shared';
import { PFXCertificate } from './_models/PFX-certificate';
import { PfxCertificateService } from './_services/pfx-certificate.service';
import { TranslateService } from '@ngx-translate/core';

/**
 * this component is created for create a pfx certificate
 */
@Component({
  selector: 'app-pfx-certificate',
  templateUrl: './pfx-certificate.component.html',
  styleUrls: ['./pfx-certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PfxCertificateComponent implements OnInit {
  /** PFX certificate inputs form */
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
   * count down time
   */
  _remainingCountDownTime = 100;
  /**
   * to handle show or hide count down
   */
  _showCountDown = false;

  constructor(
    private _fb: FormBuilder,
    private _pfxCertificateService: PfxCertificateService,
    private _toastService: ToastService,
    private _timeService: TimeService,
    private _cdr: ChangeDetectorRef,
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
    const model: PFXCertificate = {
      certificate: this._form?.get('certificate')?.value.split(',')[1],
      password: this._form?.get('password')?.value,
    };
    this._pfxCertificateService
      .addNewPFXCertificate(model)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('FPXCertificateCreateSuccessfully'),
            'success'
          );
          this._showCountDown = true;
        },
        (err: any) => {
          if (err.errors.length) {
            this._allPossibleErrors.set(err.location, '');
          } else {
            this._allPossibleErrors.set(
              err.location,
              this._translatorService.instant('AnErrorOccurredDuringUploadPFXCertificate')
            );
          }
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.detectChanges();
      });
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
          this._toastService.open(
            this._translatorService.instant('currentTimeServerInfo1'),
            'error'
          );
        }
        this._remainingCountDownTime = this._remainingCountDownTime + 1;
      }
    );
  }

  /**
   * to create form control
   */
  private _createFormControl(): void {
    this._form = this._fb.group({
      certificate: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
}
