import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LdapService } from '../_services/ldap.service';
import { LdapServerModel } from '../_models/ldap-server-model';
import { TranslateService } from '@ngx-translate/core';
import { ToastService, ErrorDisplay, ConfirmDialogService, InputRegex } from '@shared';

/** a component for add new ldap server or update them */
@Component({
  selector: 'app-ldap-add-edit',
  templateUrl: './ldap-add-edit.component.html',
  styleUrls: ['./ldap-add-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LdapAddEditComponent implements OnInit {
  /** test connection template modal before saving */
  @ViewChild('certModal')
  private _certModal!: TemplateRef<any>;
  /** create form for set ldap servers config */
  _form!: FormGroup;
  /** edit mode flag its true when edit param in the url */
  _editMode = false;
  /** set selected row data in this from url state */
  _selectedServer: LdapServerModel | undefined;
  /** it set add or edit panel card label */
  _panelTitle = this._translatorService.instant('AddLdapServer');
  /**
   * for showing alert for each possible error on this page
   * the keys will be gotten from service
   */
  _allPossibleErrors = new Map<string, string>();
  /** flag for indicating when component is busy with update ldap server */
  _updateLoading = false;
  /** flag for indicating when component is busy with test  ldap server connection */
  _testConnectionLoading = false;
  /** used to accept certificate */
  _isTestingMod = false;
  /**
   * this information would be shown to the user to decide whether to accept the connection or reject it.
   * Note that during the component's lifecycle, only this input would be changed.
   */
  _certificateInfo: Record<string, string> | undefined;
  /** previous certificate information which has to be gotten from server */
  _previousCertificate: Record<string, string> = {};

  constructor(
    private _fb: FormBuilder,
    private _ldapService: LdapService,
    private _router: Router,
    private _toastService: ToastService,
    private location: Location,
    private _confirmationModal: ConfirmDialogService,
    private _activatedRoute: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {}

  ngOnInit(): void {
    this._generateForm();
    const addMode = this._activatedRoute.snapshot?.routeConfig?.path === 'add';
    this._selectedServer = this.location.getState() as LdapServerModel;
    this._editMode = Boolean(this._selectedServer?.id);
    if (this._editMode) {
      this._panelTitle = this._translatorService.instant('EditLdapServer');
      this._patchLdapModelToForm(this._selectedServer);
    } else if (!addMode) {
      this._toastService.open(
        this._translatorService.instant('LdapServerInformationNotFound'),
        'warning'
      );
      this._navigateTo('../..');
    }
  }

  /** fire when test connection button clicked and test ldap server connection */
  _testConnection(): void {
    if (this._form.valid) {
      this._testConnectionLoading = true;
      this._isTestingMod = true;
      this._ldapService
        .testServerAvailability(this._form.value)
        .subscribe(
          () => {
            this._toastService.open(
              this._translatorService.instant('TheLdapServerAddressTestWasSuccessful'),
              'success'
            );
          },
          (err: ErrorDisplay) => {
            this._resetCertControls();
            this._handleConnectionError(err, true);
          }
        )
        .add(() => {
          this._testConnectionLoading = false;
          this._cdr.markForCheck();
        });
    } else {
      this._form.markAllAsTouched();
    }
  }

  /** it called before save any ldap servers and test connection */
  private _connectionTestBeforeUpdate(): void {
    this._certificateInfo = undefined;
    this._ldapService
      .testServerAvailability(this._form.value)
      .subscribe(
        () => {
          this._updateLdapConfigs();
        },
        (err: ErrorDisplay) => {
          this._resetCertControls();
          this._handleConnectionError(err);
        }
      )
      .add(() => {
        this._updateLoading = false;
        this._cdr.markForCheck();
      });
  }

  /** when click on submit button and save form value
   * for save and update mode call one service temporary
   * if receive success result navigate to servers list page
   */
  _submitForm(): void {
    if (this._form.valid) {
      this._updateLoading = true;
      this._isTestingMod = false;
      this._form.value.ignoreCert ? this._updateLdapConfigs() : this._connectionTestBeforeUpdate();
    } else {
      this._form.markAllAsTouched();
    }
  }

  /** accept certification when saving ldap server */
  _acceptCertificate(): void {
    if (this._certificateInfo) {
      this._form.controls.acceptCert.patchValue(true);
      this._form.controls.certificate.patchValue(this._certificateInfo);
    }
    this._isTestingMod ? this._testConnection() : this._updateLdapConfigs();
    // this._modalService.dismissAllModal();
  }

  /** it call when user accept certification */
  private _resetCertControls(): void {
    this._form.controls.acceptCert.patchValue(null);
    this._form.controls.certificate.patchValue(null);
  }

  /** handle connection errors when saving ldap server */
  private _handleConnectionError(err: any, test = false): void {
    if (err.certificateError) {
      this._previousCertificate = err.expectedCert;
      this._certificateInfo = err.actualCert;
      this._showCertificationModal(this._certModal, test);
    } else if (err.serverDown && !test) {
      this._openConfirmModal();
    } else {
      this._allPossibleErrors.set(
        err.location,
        this._translatorService.instant('certificateError2')
      );
    }
    this._cdr.markForCheck();
  }

  /** open new confirmation modal when server shutdown and get confirm from user */
  private _openConfirmModal(): void {
    // const config: ConfirmationModalConfigs = {
    //   title: this._translatorService.instant('LdapServerTest'),
    //   submitLabel: this._translatorService.instant('YesSaveIt'),
    // };
    // this._confirmationModal
    //   .openTextual(this._translatorService.instant('serverShutdownError'), config)
    //   .subscribe(() => {
    //     this._updateLdapConfigs();
    //   });
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

  /** this method update selected ldap server
   * when we want add new ldap server update's service is called again
   */
  private _updateLdapConfigs(): void {
    this._updateLoading = true;
    this._ldapService
      .updateServer(this._form.value)
      .subscribe(
        () => {
          this._toastService.open(
            this._translatorService.instant('LdapServerUpdatedSuccessfully'),
            'success'
          );
          this._editMode ? this._navigateTo('../..') : this._navigateTo('..');
        },
        err => {
          this._allPossibleErrors.set(
            err.location,
            this._translatorService.instant('ldapServerUpdateError')
          );
        }
      )
      .add(() => {
        this._updateLoading = false;
        this._cdr.markForCheck();
        this._resetCertControls();
      });
  }

  /** navigate form current url to the passed relative url */
  private _navigateTo(url: string): void {
    this._router.navigate([url], { relativeTo: this._activatedRoute }).then();
  }

  /** patch ldap model to form in edit mod */
  private _patchLdapModelToForm(model: LdapServerModel): void {
    this._form.controls.password.clearValidators();
    this._form.patchValue(model);
    this._cdr.markForCheck();
  }

  /** create reactive form group  use in add/edit mode for store server info */
  private _generateForm(): void {
    this._form = this._fb.group({
      id: [null],
      name: [null, [Validators.required]],
      address: [null, [Validators.required, Validators.pattern(InputRegex.ipVsHostname)]],
      port: [null],
      baseDn: [null, Validators.required],
      password: [null, Validators.required],
      userDn: [null, Validators.required],
      activeDirectory: [false],
      tls: [false],
      ignoreCert: [false],
      certificate: [null],
      acceptCert: [null],
    });
  }
}
