import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SyslogService } from '../_services/syslog.service';
import { SyslogServerModel } from '../_models/syslog-server';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, ErrorDisplay, InputRegex } from '@shared';

/** a component for add new syslog server or update them */
@Component({
  selector: 'app-syslog-add-edit',
  templateUrl: './syslog-add-edit.component.html',
  styleUrls: ['./syslog-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SyslogAddEditComponent implements OnInit {
  /** test connection template modal before saving */
  @ViewChild('saveModal') saveModal: TemplateRef<any> | undefined;
  /** test connection template modal */
  @ViewChild('testConnectionModal') testConnectionModal: TemplateRef<any> | undefined;
  /** create form for set syslog servers cinfig */
  _form: FormGroup | undefined;
  /** edit mode flag its true when edit param in the url */
  _editMode = false;
  /** set selected row data in this from url state */
  _selectedServer: SyslogServerModel | undefined;
  /** it set add or edit panel card label */
  _panelTitle = this._translatorService.instant('AddSyslogServer');
  /** syslog servers sub categories list */
  _categories: string[] = [];
  /** syslog server log types list */
  _logTypes = ['RFC5424', 'RFC3164', 'RFC5425'];
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();

  /** flag for indicating when component is busy with update syslog server */
  _updateLoading = false;
  /** flag for indicating when component is busy with test  syslog server connection */
  _testConnectionLoading = false;
  /**
   * this information would be shown to the user to decide whether to accept the connection or reject it.
   * Note that during the component's lifecycle, only this input would be changed.
   */
  _certificateInfo: Readonly<Record<string, string>> | undefined;
  /** previous certificate information which has to be gotten from server */
  _previousCertificate: Record<string, string> = {};
  /** shown down remote error alert */
  _testConnectionErrorAlert = false;
  /** shown down remote error alert */
  _downRemoteError = false;

  constructor(
    private _fb: FormBuilder,
    private _syslogService: SyslogService,
    private _router: Router,
    private _toastService: ToastService,
    private _activatedRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._generateForm();
    this._getCategories();
    const addMode = this._activatedRoute.snapshot?.routeConfig?.path === 'add';
    this._selectedServer = history.state;
    this._editMode = Boolean(this._selectedServer?.id);
    if (this._editMode) {
      this._panelTitle = this._translatorService.instant('EditSyslogServer');
      this._patchSysLogModelToForm(history.state);
    } else if (!addMode) {
      // if was not state id(server id) in url and not add mode back to list page
      this._navigateTo('../..');
    }
  }

  /** fire when test connection button clicked and test syslog server connection */
  _testConnection(): void {
    if (this._form?.valid) {
      this._testConnectionLoading = true;
      this._clearAllPossibleErrors();
      const form = Object.assign({}, this._form?.value);
      delete form.acceptCert;
      this._syslogService
        .testServerAvailability(form)
        .subscribe(
          () => {
            this._showSuccessToast();
            // this._modalService.dismissActiveModal();
          },
          (err: ErrorDisplay) => {
            this._form?.controls.acceptCert.patchValue(null);
            this._form?.controls.certificate.patchValue(null);
            this._handleConnectionError(err, true);
          }
        )
        .add(() => {
          this._testConnectionLoading = false;
          this._cdr.markForCheck();
        });
    } else {
      this._form?.markAllAsTouched();
    }
  }

  /** when click on submit button and save form value
   * for save and update mode call one service temporary
   * if receive success result navigate to servers list page
   */
  _submitForm(): void {
    if (this._form?.valid) {
      this._updateLoading = true;
      this._form?.value.ignoreCert ? this._updateSyslog() : this._connectionTestBeforeUpdate();
    } else {
      this._form?.markAllAsTouched();
    }
  }

  /** accept certification when saving syslog server */
  _submitCert(): void {
    if (this._certificateInfo) {
      this._form?.controls.acceptCert.patchValue(true);
      this._form?.controls.certificate.patchValue(this._certificateInfo);
    } else {
      this._form?.controls.acceptCert.patchValue(null);
      this._form?.controls.certificate.patchValue(null);
    }
    this._updateSyslog();
    // this._modalService.dismissAllModal();
  }

  /** retry syslog server connection with accept certification  */
  _tryTestConnection(): void {
    this._form?.controls.acceptCert.patchValue(true);
    this._form?.controls.certificate.patchValue(this._certificateInfo);
    this._testConnection();
  }

  /** it called before save any syslog servers and test connection */
  private _connectionTestBeforeUpdate(): void {
    this._clearAllPossibleErrors();
    const form = Object.assign({}, this._form?.value);
    delete form.acceptCert;
    this._syslogService
      .testServerAvailability(form)
      .subscribe(
        () => {
          this._updateSyslog();
        },
        (err: ErrorDisplay) => {
          this._form?.controls.acceptCert.patchValue(null);
          this._form?.controls.certificate.patchValue(null);
          this._handleConnectionError(err);
        }
      )
      .add(() => {
        this._updateLoading = false;
        this._cdr.markForCheck();
      });
  }

  private _clearAllPossibleErrors(): void {
    this._downRemoteError = false;
    this._testConnectionErrorAlert = false;
    this._certificateInfo = undefined;
  }

  /** handle connection errors when saving syslog server */
  private _handleConnectionError(err: any, test = false): void {
    if (err.certificateError) {
      this._previousCertificate = err.expectedCert;
      this._certificateInfo = err.actualCert;
      this._showCertificationModal(this.saveModal!);
    } else if (err.serverDown) {
      if (test || !this._certificateInfo) {
        this._allPossibleErrors.set(
          err.location,
          this._translatorService.instant('certificateError')
        );
        return;
      }
      if (this._certificateInfo) {
        this._showCertificationModal(this.testConnectionModal!, true);
      }
      this._downRemoteError = true;
    } else {
      this._allPossibleErrors.set(
        err.location,
        this._translatorService.instant('certificateError2')
      );
    }
    this._cdr.markForCheck();
  }

  private _showSuccessToast(): void {
    this._toastService.open(this._translatorService.instant('certificateError3'), 'success');
  }

  /** it open lib modal for show certification info */
  private _showCertificationModal(modalContent: TemplateRef<any>, testMod = false): void {
    // testMod
    //   ? this._modalService.showModal(modalContent, {
    //       submitBtnLabel: this._translatorService.instant('YesTestIt'),
    //       backdrop: false,
    //     })
    //   : this._modalService.showModal(modalContent, {
    //       submitBtnLabel: this._translatorService.instant('YesSaveIt'),
    //       backdrop: false,
    //     });
  }

  /** this method update selected syslog server
   * when we want add new syslog server update's service is called again
   */
  private _updateSyslog(): void {
    this._clearAllPossibleErrors();
    this._updateLoading = true;
    const form = Object.assign({}, this._form?.value);
    if (this._form?.controls.certificate.value === null) {
      delete form.acceptCert;
    }
    this._syslogService
      .updateServer(form)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('syslogServerSuccessUpdate'),
            'success'
          );
          this._editMode ? this._navigateTo('../..') : this._navigateTo('..');
        },
        err => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('syslogServerUpdateError')
          );
        }
      )
      .add(() => {
        this._updateLoading = false;
        this._cdr.markForCheck();
      });
  }

  /** navigate form current url to the passed relative url */
  private _navigateTo(url: string): void {
    this._router.navigate([url], { relativeTo: this._activatedRoute }).then();
  }

  /** it get syslog categories */
  private _getCategories(): void {
    this._syslogService.getSyslogCategories().subscribe(
      (res: string[]) => {
        this._cdr.markForCheck();
        this._categories = res;
      },
      err => {
        this._allPossibleErrors.set(
          err.location,
          this._translatorService.instant('ErrorWhileGettingSyslogCategoryList')
        );
        this._cdr.markForCheck();
      }
    );
  }

  /** patch syslog model to form */
  private _patchSysLogModelToForm(model: SyslogServerModel): void {
    this._form?.patchValue(model);
    this._cdr.markForCheck();
  }

  /** create reactive form group  use in add/edit mode for store server info */
  private _generateForm(): void {
    this._form = this._fb.group({
      id: [null],
      address: [null, [Validators.required, Validators.pattern(InputRegex.ipVsHostname)]],
      port: [null, Validators.required],
      protocol: ['udp', Validators.required],
      syslogRfc: [null, Validators.required],
      subCategories: [[]],
      ssl: [null],
      ignoreCert: [null],
      acceptCert: [null],
      certificate: [null],
    });
  }
}
