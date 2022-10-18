import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VerificatePage } from './verificate.page';

const routes: Routes = [
  {
    path: '',
    component: VerificatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VerificatePageRoutingModule {}
