import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LoginConstraint } from '@shared';

/**
 * edit form in the modal for login constraint
 */
@Component({
  selector: 'app-login-constraint-edit',
  templateUrl: './login-constraint-edit.component.html',
  styleUrls: ['./login-constraint-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginConstraintEditComponent implements OnInit, OnDestroy {
  /**
   * edit items from parent component
   */
  @Input() editItems: Readonly<LoginConstraint> | undefined;
  /**
   * two way form value change binding data
   */
  @Output() editItemsChange = new EventEmitter<LoginConstraint>();
  /**
   * edit form
   */
  editForm: FormGroup | undefined;
  /**
   * on destroy method
   */
  private _onDestroy = new Subject<void>();

  /**
   *
   * @param fb:FormBuilder
   * @param _translatorService:TranslateService
   */
  constructor(
    private fb: FormBuilder,
    private _translatorService: TranslateService
  ) {}

  /**
   * on destroy method
   */
  ngOnDestroy(): void {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  /**
   * create form
   */
  ngOnInit(): void {
    this.createForm();
    if (this.editForm) {
      this.watcherForm();
    }
  }

  /**
   * watch From
   */
  watcherForm(): void {
    this.editForm?.valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this._onDestroy))
      .subscribe(data => {
        this.editItemsChange.emit(data);
      });
  }

  /**
   * to create edit form
   */
  createForm(): void {
    this.editForm = this.fb.group({
      captchaSessionThreshold: [
        this.editItems?.captchaSessionThreshold,
        [Validators.required, Validators.min(5), Validators.max(100)],
      ],
      captchaIpThreshold: [
        this.editItems?.captchaIpThreshold,
        [Validators.required, Validators.min(5), Validators.max(1000)],
      ],
      lockThreshold: [
        this.editItems?.lockThreshold,
        [Validators.required, Validators.min(5), Validators.max(100)],
      ],
      lockMinutes: [
        this.editItems?.lockMinutes,
        [Validators.required, Validators.min(5), Validators.max(365 * 24 * 60)],
      ],
      defaultOtpMedia: [this.editItems?.defaultOtpMedia, Validators.required],
      otpValidTimeSeconds: [
        this.editItems?.otpValidTimeSeconds,
        [Validators.required, Validators.min(120), Validators.max(5 * 60 * 60)],
      ],
      otpRetryMax: [
        this.editItems?.otpRetryMax,
        [Validators.required, Validators.min(5), Validators.max(100)],
      ],
      otpResendMax: [
        this.editItems?.otpResendMax,
        [Validators.required, Validators.min(5), Validators.max(100)],
      ],
      tokenRetryMax: [
        this.editItems?.tokenRetryMax,
        [Validators.required, Validators.min(5), Validators.max(100)],
      ],
      minPassLength: [
        this.editItems?.minPassLength,
        [Validators.required, Validators.min(8), Validators.max(128)],
      ],
    });
  }
}
