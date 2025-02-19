import { Routes } from '@angular/router';
import { CertificateComponent } from './certificate.component';

export const certRoutes: Routes = [
  {
    path: '',
    component: CertificateComponent,
    children: [
      {
        path: 'remote-machine-ca',
        loadChildren: () =>
          import('./remote-machines-ca/remote-machines-ca.component').then(
            m => m.RemoteMachinesCaComponent
          ),
      },
      {
        path: 'csr-certificate',
        loadChildren: () =>
          import('./csr-certificate/_components/wina-csr/wina-csr.component').then(
            m => m.WinaCsrComponent
          ),
      },
      {
        path: 'pfx-certificate',
        loadChildren: () =>
          import('./pfx-certificate/pfx-certificate.component').then(
            m => m.PfxCertificateComponent
          ),
      },
      {
        path: 'self-signed',
        loadChildren: () =>
          import('./self-signed-config/self-signed-config.component').then(
            m => m.SelfSignedConfigComponent
          ),
      },
      { path: '', redirectTo: 'remote-machine-ca', pathMatch: 'full' },
    ],
  },
];
