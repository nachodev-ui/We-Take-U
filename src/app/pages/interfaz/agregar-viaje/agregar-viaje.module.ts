import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AgregarViajePageRoutingModule } from './agregar-viaje-routing.module';

import { AgregarViajePage } from './agregar-viaje.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AgregarViajePageRoutingModule
  ],
  declarations: [AgregarViajePage]
})
export class AgregarViajePageModule {}
