import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroConductorPage } from './registro-conductor.page';

import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: RegistroConductorPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  exports: [
    RouterModule,
    ReactiveFormsModule
  ],
})
export class RegistroConductorPageRoutingModule {}
