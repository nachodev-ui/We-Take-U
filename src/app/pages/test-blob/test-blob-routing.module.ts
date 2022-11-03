import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestBlobPage } from './test-blob.page';

const routes: Routes = [
  {
    path: '',
    component: TestBlobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestBlobPageRoutingModule {}
