import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PasajeroPageRoutingModule } from './pasajero-routing.module';

import { PasajeroPage } from './pasajero.page';
import { PasajeroModalComponent } from '../../pasajero-modal/pasajero-modal.component';

import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { TranslateModule } from '@ngx-translate/core';
import { JoyrideModule } from 'ngx-joyride';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasajeroPageRoutingModule,
    Ng2SearchPipeModule,
    TranslateModule,
    JoyrideModule.forChild(),
  ],
  declarations: [
    PasajeroPage,
    PasajeroModalComponent
  ],
  entryComponents: [
    PasajeroModalComponent
  ]
})
export class PasajeroPageModule {}
