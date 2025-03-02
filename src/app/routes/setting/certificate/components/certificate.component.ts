import { TranslatePipe } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';

import { CaCertificateComponent } from './ca/ca-certificate.component';
import { CertificateStore } from '../services/certificate-store.service';
import { SelfSignedCertComponent } from './self-signed/self-signed-cert.component';

@Component({
  selector: 'app-certificate',
  templateUrl: './certificate.component.html',
  styleUrls: ['./certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [CertificateStore],
  imports: [
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    TranslatePipe,
    MatTooltipModule,
    CaCertificateComponent,
    SelfSignedCertComponent,
  ],
})
export class CertificateComponent implements OnInit {
  store = inject(CertificateStore);

  constructor() {}

  ngOnInit(): void {
    this.store.state$.subscribe({ next: value => console.log(value) });
    this.store.loadList();
    this.store.getTLSConfig();
  }
}
