import { Observable, of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { MonitoringListStore } from '../_services/project-store.service';
/**
 * this component is created to show all monitoring,s apis
 */
@Component({
  selector: 'app-monitoring-list',
  templateUrl: './monitoring-list.component.html',
  styleUrls: ['./monitoring-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MonitoringListStore],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ScrollingModule,
    TranslatePipe,
  ],
})
export class MonitoringListComponent implements OnInit {
  readonly filteredRow$ = this.store.filteredRow$;
  count$: Observable<number | undefined> = of();
  token$: Observable<string | undefined> = of();
  searchTerm$: Observable<string> = of('');

  constructor(
    private store: MonitoringListStore,
    private _translatorService: TranslateService
  ) {
    this.token$ = this.store.select(state => state.token);
    this.count$ = this.store.select(state => state.count);
    this.searchTerm$ = this.store.select(state => state.searchTerm);
  }

  ngOnInit(): void {
    // Trigger the effect to load token and then list.
    this.store.loadTokenAndList();
  }

  updateSearch(query: string): void {
    this.store.setSearchTerm(query);
  }

  refreshToken(): void {
    this.store.refreshTokenEffect();
  }

  copyToClipboard(data?: string | undefined): void {
    this.store.copyEffect(data);
  }
}
