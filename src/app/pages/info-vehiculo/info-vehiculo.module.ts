import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InfoVehiculoPageRoutingModule } from './info-vehiculo-routing.module';

import { InfoVehiculoPage } from './info-vehiculo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InfoVehiculoPageRoutingModule
  ],
  declarations: [InfoVehiculoPage]
})
export class InfoVehiculoPageModule {}
