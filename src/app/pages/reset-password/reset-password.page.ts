import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  formularioReset: FormGroup;

  currentUserEmail: string;

  constructor(
    private router: Router,
    public builder: FormBuilder,
    public alert: AlertController,
    public navCtrl: NavController,
    private authService: AuthService
    ) {
    this.formularioReset = this.builder.group({
      'email': new FormControl('', Validators.required),


    });
   }

  ngOnInit() {
  }

  backToHome() {
    this.router.navigate(['home']);
  }

  async alertResetPassword() {
    const alert = await this.alert.create({
      cssClass: 'my-custom-class',
      header: '¡Enviado!',
      message: 'Se ha enviado un correo a tu cuenta de correo electrónico.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async onReset() {
    var form = this.formularioReset.value.email;
    this.authService.sendRessetPasswordEmail(form).then(() => {
      this.alertResetPassword();
      setTimeout(() => {
        this.router.navigate(['reset-password/verify']);
      }, 1000);
    });
  }

}




