import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CModalPageRoutingModule } from './c-modal-routing.module';

import { CModalPage } from './c-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CModalPageRoutingModule
  ],
  declarations: [CModalPage]
})
export class CModalPageModule {}
