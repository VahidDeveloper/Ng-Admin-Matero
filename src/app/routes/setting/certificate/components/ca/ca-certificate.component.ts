import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CACertificate } from '../../_models/CA-certificate';
import { CertificateStore } from '../../services/certificate-store.service';
import { MatDialogModule } from '@angular/material/dialog';

/**
 * this component is created to show list of remote machines CA certificate
 */
@Component({
  selector: 'app-ca-cert',
  templateUrl: './ca-certificate.component.html',
  styleUrls: ['./ca-certificate.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressBarModule,
    ScrollingModule,
    TranslatePipe,
  ],
})
export class CaCertificateComponent {
  store = inject(CertificateStore);
  readonly filteredRow$ = this.store.filteredRow$;
  count$: Observable<number | undefined> = of();
  token$: Observable<string | undefined> = of();
  searchTerm$: Observable<string> = of('');
  /**
   * a flag to show loading on get data
   */
  fetchLoading$: Observable<boolean> = of(false);
  constructor() {
    this.token$ = this.store.select(state => state.token);
    this.count$ = this.store.select(state => state.count);
    this.searchTerm$ = this.store.select(state => state.searchTerm);
    this.fetchLoading$ = this.store.select(state => state.isLoading);
  }

  updateSearch(query: string): void {
    this.store.setSearchTerm(query);
  }

  add() {
    this.store.addCa();
  }

  delete(item: CACertificate) {
    this.store.deleteCert(item);
  }
}
