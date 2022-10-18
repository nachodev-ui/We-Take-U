import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasajeroViajesPageRoutingModule } from './pasajero-viajes-routing.module';

import { PasajeroViajesPage } from './pasajero-viajes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasajeroViajesPageRoutingModule
  ],
  declarations: [PasajeroViajesPage]
})
export class PasajeroViajesPageModule {}
