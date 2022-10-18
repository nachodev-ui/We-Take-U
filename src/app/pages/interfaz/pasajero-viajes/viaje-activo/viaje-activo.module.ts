import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ViajeActivoPageRoutingModule } from './viaje-activo-routing.module';

import { ViajeActivoPage } from './viaje-activo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViajeActivoPageRoutingModule
  ],
  declarations: [ViajeActivoPage]
})
export class ViajeActivoPageModule {}
