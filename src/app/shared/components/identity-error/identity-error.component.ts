import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CertificateArguments, KeyHashArguments } from '@shared/enums';
import { KeyWithCustomTemplate } from '@shared/models';

/**
 * a component to show certificate error based on current-certificate and previous-certificate.
 * it would be used in remote-machine connections and in email, ldap, ... forms
 * so when changing this component, take all these places into consideration.
 */
@Component({
  selector: 'app-identity-error',
  templateUrl: './identity-error.component.html',
  styleUrls: ['./identity-error.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatTooltipModule, TranslatePipe],
})
export class IdentityErrorComponent implements OnInit {
  /**
   * current certificate's information from guacd or somewhere else.
   * this information would be shown to the user to decide whether to accept the connection or reject it.
   */
  @Input() certificateInfo: Record<string, string> | undefined;
  /**
   * previous certificate's information.
   * it should be compared with current certificate.
   */
  @Input() previousCertificateInfo: Record<string, string> | undefined;
  /**
   * whether to accept certificate or key-hash.
   * in ldap form, email config and the like, it should be true.
   */
  @Input() readonly isCertificateError: boolean | undefined;
  /**
   * list of keys to be shown via key-value-list component.
   */
  _certKeys: KeyWithCustomTemplate[] = [];
  /**
   * argument keys' translations.
   */
  translation = {
    [CertificateArguments.Subject]: this.tr.instant('Subject'),
    [CertificateArguments.Issuer]: this.tr.instant('Issuer'),
    [CertificateArguments.CommonName]: this.tr.instant('CommonName'),
    [CertificateArguments.Fingerprint]: this.tr.instant('secondFA_FINGERPRINT'),
    [KeyHashArguments.HostKeyHash]: this.tr.instant('HostKeyHash'),
  };
  /**
   * template to show the value of a certificate key.
   */
  @ViewChild('certificateValueTemplate', { static: true })
  private _certificateValueTemplate: TemplateRef<any> | undefined;

  constructor(private tr: TranslateService) {}

  ngOnInit(): void {
    const expectedKeys: string[] = this.isCertificateError
      ? Object.values(CertificateArguments)
      : Object.values(KeyHashArguments);
    this._certKeys = expectedKeys.map(key => ({
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      keyToDisplay: this.translation[key],
      key,
      customTemplate: this._certificateValueTemplate,
      withoutDefaultClass: true,
    }));
  }
}
