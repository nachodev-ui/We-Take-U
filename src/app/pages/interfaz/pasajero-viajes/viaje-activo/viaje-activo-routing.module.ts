import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViajeActivoPage } from './viaje-activo.page';

const routes: Routes = [
  {
    path: '',
    component: ViajeActivoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViajeActivoPageRoutingModule {}
