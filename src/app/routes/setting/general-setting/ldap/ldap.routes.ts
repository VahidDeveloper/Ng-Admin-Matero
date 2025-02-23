import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LdapComponent } from './ldap.component';
import { LdapListComponent } from './ldap-list/ldap-list.component';
import { LdapAddEditComponent } from './ldap-add-edit/ldap-add-edit.component';

export const routes: Routes = [
  {
    path: '',
    component: LdapComponent,
    children: [
      { path: '', component: LdapListComponent },
      { path: 'add', component: LdapAddEditComponent },
      { path: 'edit/:id', component: LdapAddEditComponent },
    ],
  },
];
