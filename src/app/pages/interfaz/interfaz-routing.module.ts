import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InterfazPage } from './interfaz.page';

const routes: Routes = [
  {
    path: '',
    component: InterfazPage,
  },
  {
    path: 'pasajero',
    loadChildren: () => import('./pasajero/pasajero.module').then( m => m.PasajeroPageModule)
  },
  {
    path: 'conductor',
    loadChildren: () => import('./conductor/conductor.module').then( m => m.ConductorPageModule)
  },
  {
    path: 'agregar-viaje',
    loadChildren: () => import('./agregar-viaje/agregar-viaje.module').then( m => m.AgregarViajePageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./perfil/perfil.module').then( m => m.PerfilPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterfazPageRoutingModule {}
