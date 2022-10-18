import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AgregarViajePage } from './agregar-viaje.page';

const routes: Routes = [
  {
    path: '',
    component: AgregarViajePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AgregarViajePageRoutingModule {}
