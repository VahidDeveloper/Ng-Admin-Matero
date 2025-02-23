import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SyslogComponent } from './syslog.component';
import { SyslogListComponent } from './syslog-list/syslog-list.component';
import { SyslogAddEditComponent } from './syslog-add-edit/syslog-add-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: SyslogComponent,
    children: [
      { path: '', component: SyslogListComponent },
      { path: 'edit/:id', component: SyslogAddEditComponent },
      { path: 'add', component: SyslogAddEditComponent },
    ],
  },
];
