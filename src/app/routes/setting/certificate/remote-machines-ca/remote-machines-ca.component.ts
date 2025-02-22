import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { RemoteMachineCertificateService } from './_services/remote-machine-certificate.service';
import { CACertificate } from './_models/CA-certificate';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@shared';
import { TranslateService } from '@ngx-translate/core';

/**
 * this component is created to show list of remote machines CA certificate
 */
@Component({
  selector: 'app-remote-machines-ca',
  templateUrl: './remote-machines-ca.component.html',
  styleUrls: ['./remote-machines-ca.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteMachinesCaComponent implements OnInit {
  /**
   * a list to show in ui
   */
  _dataSource: CACertificate[] = [];
  /**
   * a flag to show loading on get data
   */
  _isLoading = false;
  /**
   * a flag to show loading on post on add form
   */
  _isFormLoading = false;
  /**
   * for showing alert for each possible error get CA certificate
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /**
   * for showing alert for each possible error add CA certificate
   * the keys will be gotten from service
   */
  _allPossibleFormErrors = new Map<string, string>();

  /**
   * a form group to handle form control
   */
  _form: FormGroup | undefined;
  /**
   * a template to show add action in form
   */
  @ViewChild('addNewCATemplate') private _addNewCATemplate: TemplateRef<any> | undefined;

  constructor(
    private _remoteMachineCertificateService: RemoteMachineCertificateService,
    private _toastService: ToastService,
    private _fb: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._getAllCaList();
  }

  /**
   * to add new CA certificate
   */
  addNewCA() {
    this._form = this._fb.group({
      name: [null, Validators.required],
      certificate: [null, Validators.required],
    });
    // this._modalService
    //   .showModal(this._addNewCATemplate, {
    //     submitBtnLabel: this._translatorService.instant('Submit'),
    //     cancelBtnLabel: this._translatorService.instant('close'),
    //   })
    //   .subscribe(() => {
    //     this._getAllCaList();
    //   });
  }

  /**
   * to submit new CA to api
   */
  submit() {
    if (this._form?.invalid) {
      this._form?.markAllAsTouched();
      return;
    }
    this._isFormLoading = true;
    this._remoteMachineCertificateService
      .addCaCertificate(this._form?.value)
      .subscribe(
        (res: CACertificate) => {
          this._toastService.open(
            `${this._translatorService.instant('The')} ${res.name} ${this._translatorService.instant(
              'certificateCreatedSuccessfully'
            )}`,
            'success'
          );
          // this._modalService.closeActiveModal();
        },
        (err: any) => {
          if (err.errors.length) {
            this._allPossibleFormErrors.set(err.location, '');
          } else {
            this._allPossibleFormErrors.set(
              err.location,
              this._translatorService.instant('AnErrorOccurredWhileAdd_CA_Certificate')
            );
          }
        }
      )
      .add(() => {
        this._isFormLoading = false;
        this._cdr.detectChanges();
      });
  }

  /**
   * to delete CA certificate
   */
  confirmDeleteCa(item: CACertificate) {}

  /**
   * get all CA remote machine certificate
   */
  private _getAllCaList() {
    this._isLoading = true;
    this._remoteMachineCertificateService
      .getCaCertificate()
      .subscribe(
        (res: CACertificate[]) => {
          this._dataSource = res;
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileFetch_CA_Certificate')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
        this._cdr.detectChanges();
      });
  }

  /**
   * to post a CA certificate to server for delete it
   */
  private _deleteCaCertificate(CaCertificate: CACertificate) {
    this._isLoading = true;
    this._remoteMachineCertificateService
      .deleteCaCertificate(CaCertificate)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('CertificateSuccessfullyRemoved'),
            'success'
          );
          this._getAllCaList();
        },
        (err: any) => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('AnErrorOccurredWhileDeleteCertificate')
          );
        }
      )
      .add(() => {
        this._isLoading = false;
      });
  }
}
