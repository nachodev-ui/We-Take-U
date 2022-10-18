import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CModalPage } from './c-modal.page';

const routes: Routes = [
  {
    path: '',
    component: CModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CModalPageRoutingModule {}
