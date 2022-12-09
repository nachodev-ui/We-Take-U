import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApiTestPage } from './api-test.page';

const routes: Routes = [
  {
    path: '',
    component: ApiTestPage
  },
  {
    path: 'detalle-viaje',
    loadChildren: () => import('./detalle-viaje/detalle-viaje.module').then( m => m.DetalleViajePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ApiTestPageRoutingModule {}
