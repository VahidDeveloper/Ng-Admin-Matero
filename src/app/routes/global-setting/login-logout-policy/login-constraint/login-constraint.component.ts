import { ModalService } from '@mahsan/ng-components';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';

import { LoginConstraintConfigService } from '@phoenix-front-apps/wina-services';
import { LoginConstraint, KeyWithCustomTemplate } from '@phoenix-front-apps/models';
import { Breadcrumb, BreadcrumbItem } from '@phoenix-front-apps/ng-core';
import { TranslateService } from '@phoenix-front-apps/ng-core';
/**
 * app login constraint component to show conditions
 */
@Component({
  selector: 'app-login-constraint',
  templateUrl: './login-constraint.component.html',
  styleUrls: ['./login-constraint.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginConstraintComponent implements OnInit {
  @Breadcrumb() breadcrumb: BreadcrumbItem = {
    text: this._translatorService.instant('LOGIN_CONSTRAINT_MENU'),
  };

  /**
   * error occurs when user has problem in the getting data
   */
  listErrorLocation = '';
  /**
   * login constraint data for edit form
   */
  loginConstraintFromData: LoginConstraint;
  /**
   * login constraint list
   */
  loginConstraint: LoginConstraint;
  /**
   * is loading for list and edit
   */
  isLoading = {
    list: false,
    edit: false,
  };
  /**
   * list of item to use in the key value component
   */
  listOfItem: KeyWithCustomTemplate[];
  /**
   * template sms to show in the list
   */
  @ViewChild('optSendMedia', { static: true })
  private _otpSendMedia: TemplateRef<any>;
  /**
   * template sms to show in the list
   */
  @ViewChild('modal', { static: true }) private _modalTemp: TemplateRef<any>;

  /**
   *
   * @param loginConstraintService:Login constraint config service
   * @param _modalService : ModalService
   * @param _ref:change detector ref
   * @param _translatorService
   */
  constructor(
    private loginConstraintService: LoginConstraintConfigService,
    private _modalService: ModalService,
    private _ref: ChangeDetectorRef,
    private _translatorService: TranslateService
  ) {}

  /**
   * get list of data
   */
  ngOnInit(): void {
    this.getConstraintList();
    this.createListItem();
  }

  /**
   * get data from service and change loading state
   */
  getConstraintList(): void {
    this.isLoading = {
      ...this.isLoading,
      list: true,
    };
    this._ref.markForCheck();
    this.loginConstraintService
      .getConstraint()
      .subscribe(
        (data: LoginConstraint) => {
          this.loginConstraintFromData = this.loginConstraint = data;
        },
        err => {
          this.listErrorLocation = err.location;
        }
      )
      .add(() => {
        this.isLoading = {
          ...this.isLoading,
          list: false,
        };
        this._ref.markForCheck();
      });
  }

  /**
   * edit method to open modal and edit
   */
  editModal(): void {
    this._modalService.showModal(this._modalTemp, {
      size: 'lg',
      centered: true,
      submitBtnLabel: this._translatorService.instant('Submit'),
      cancelBtnLabel: this._translatorService.instant('close'),
    });
  }

  /**
   * when user submit for , saved service should called and check error
   */
  submitForm(): void {
    this.isLoading = {
      ...this.isLoading,
      edit: true,
    };
    this._ref.markForCheck();
    this.loginConstraintService
      .saveConstraint(this.loginConstraintFromData)
      .subscribe(
        (res: any) => {
          this._modalService.closeActiveModal();
          this.loginConstraintFromData = this.loginConstraint = res;
        },
        err => {
          this.listErrorLocation = err.location;
        }
      )
      .add(() => {
        this.isLoading = {
          ...this.isLoading,
          edit: false,
        };
        this._ref.markForCheck();
      });
  }

  /**
   * create list to pass in the key value component
   */
  createListItem(): void {
    this.listOfItem = [
      {
        key: 'captchaSessionThreshold',
        keyToDisplay: this._translatorService.instant('captchaSessionThreshold'),
      },
      {
        key: 'captchaIpThreshold',
        keyToDisplay: this._translatorService.instant('captchaIpThreshold'),
      },
      {
        key: 'lockThreshold',
        keyToDisplay: this._translatorService.instant('lockThreshold'),
      },
      {
        key: 'lockMinutes',
        keyToDisplay: this._translatorService.instant('lockMinutes'),
      },
      {
        key: 'defaultOtpMedia',
        keyToDisplay: this._translatorService.instant('defaultOtpMedia'),
        customTemplate: this._otpSendMedia,
      },
      {
        key: 'otpValidTimeSeconds',
        keyToDisplay: this._translatorService.instant('otpValidTimeSeconds'),
      },
      {
        key: 'otpRetryMax',
        keyToDisplay: this._translatorService.instant('otpRetryMax'),
      },
      {
        key: 'otpResendMax',
        keyToDisplay: this._translatorService.instant('otpResendMax'),
      },
      {
        key: 'tokenRetryMax',
        keyToDisplay: this._translatorService.instant('tokenRetryMax'),
      },
      {
        key: 'minPassLength',
        keyToDisplay: this._translatorService.instant('minPassLength'),
      },
    ];
  }
}
