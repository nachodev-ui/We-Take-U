import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GooglemapsPageRoutingModule } from './googlemaps-routing.module';
import { GooglemapsPage } from './googlemaps.page';

import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { TranslateModule } from '@ngx-translate/core';

import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GooglemapsPageRoutingModule,
    GooglePlaceModule,
    TranslateModule,
    QRCodeModule
  ],
  declarations: [GooglemapsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GooglemapsPageModule {

  constructor() { }



}
