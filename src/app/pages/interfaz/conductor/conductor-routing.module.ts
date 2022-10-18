import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ConductorPage } from './conductor.page';

const routes: Routes = [
  {
    path: '',
    component: ConductorPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
})
export class ConductorPageRoutingModule {}
