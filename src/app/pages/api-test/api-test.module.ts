import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ApiTestPageRoutingModule } from './api-test-routing.module';

import { ApiTestPage } from './api-test.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ApiTestPageRoutingModule,
    TranslateModule
  ],
  declarations: [ApiTestPage]
})
export class ApiTestPageModule {}
