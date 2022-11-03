import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroConductorPageRoutingModule } from './registro-conductor-routing.module';

import { RegistroConductorPage } from './registro-conductor.page';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroConductorPageRoutingModule,
    TranslateModule
  ],
  declarations: [RegistroConductorPage]
})
export class RegistroConductorPageModule {}
