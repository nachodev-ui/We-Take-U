import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerificateConductorPageRoutingModule } from './verificate-conductor-routing.module';

import { VerificateConductorPage } from './verificate-conductor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerificateConductorPageRoutingModule
  ],
  declarations: [VerificateConductorPage]
})
export class VerificateConductorPageModule {}
