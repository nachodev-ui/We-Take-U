import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';

import { Routes, RouterModule } from '@angular/router';

import { InfoVehiculoPage } from './info-vehiculo.page';

const routes: Routes = [
  {
    path: '',
    component: InfoVehiculoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    ReactiveFormsModule
  ],
})
export class InfoVehiculoPageRoutingModule {}
