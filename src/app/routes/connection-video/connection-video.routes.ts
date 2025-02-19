import { Routes } from '@angular/router';
import { ConnectionVideoPageComponent } from './_components/connection-video-page/connection-video-page.component';

export const routes: Routes = [
  { path: '', component: ConnectionVideoPageComponent },
  { path: ':id/:forcedVideoPoint', component: ConnectionVideoPageComponent },
];
