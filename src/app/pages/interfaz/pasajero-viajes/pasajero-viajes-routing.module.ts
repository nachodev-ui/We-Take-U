import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PasajeroViajesPage } from './pasajero-viajes.page';

const routes: Routes = [
  {
    path: '',
    component: PasajeroViajesPage
  },
  {
    path: 'viaje-activo',
    loadChildren: () => import('./viaje-activo/viaje-activo.module').then( m => m.ViajeActivoPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [RouterModule],
})
export class PasajeroViajesPageRoutingModule {}
