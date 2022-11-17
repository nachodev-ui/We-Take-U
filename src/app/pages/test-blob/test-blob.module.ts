import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestBlobPageRoutingModule } from './test-blob-routing.module';

import { TestBlobPage } from './test-blob.page';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestBlobPageRoutingModule,
    QRCodeModule
  ],
  declarations: [TestBlobPage]
})
export class TestBlobPageModule {}
