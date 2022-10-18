import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RegistroConductorPageRoutingModule } from './registro-conductor-routing.module';

import { RegistroConductorPage } from './registro-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RegistroConductorPageRoutingModule
  ],
  declarations: [RegistroConductorPage]
})
export class RegistroConductorPageModule {}
