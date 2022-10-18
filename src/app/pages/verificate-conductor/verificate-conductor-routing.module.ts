import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificateConductorPage } from './verificate-conductor.page';

const routes: Routes = [
  {
    path: '',
    component: VerificateConductorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificateConductorPageRoutingModule {}
