import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DriverComponent } from './driver/driver.component';
import { RegisterComponent } from './register/register.component';
import { IonicModule } from '@ionic/angular';

export const components = [
  DriverComponent,
  RegisterComponent
];

@NgModule({
  declarations: components,
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: components
})
export class ComponentsModule { }
