import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestBlobPageRoutingModule } from './test-blob-routing.module';

import { TestBlobPage } from './test-blob.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestBlobPageRoutingModule,
  ],
  declarations: [TestBlobPage]
})
export class TestBlobPageModule {}
