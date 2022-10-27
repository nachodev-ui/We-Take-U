import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LanguagePopoverPage } from './language-popover.page';

import { TranslateModule } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: LanguagePopoverPage
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    TranslateModule
  ],
  exports: [
    RouterModule,
    TranslateModule
  ],
})
export class LanguagePopoverPageRoutingModule {}
