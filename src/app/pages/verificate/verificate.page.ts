import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verificate',
  templateUrl: './verificate.page.html',
  styleUrls: ['./verificate.page.scss'],
})
export class VerificatePage implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.dissapearButton();
  }

  ionViewDidEnter() {
    this.appearButton();
  }

  dissapearButton() {
    document.getElementById('btn-vef').style.display = 'none';
  }

  appearButton() {
    setTimeout(() => {
      document.getElementById('btn-vef').style.display = 'block';
    }, 7000);
  }

  async verifing() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Verificando cuenta',
      spinner: 'bubbles',
      duration: 1000
    });
    await loading.present();
  }

  async alertCorrectVerified() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Cuenta verificada',
      message: 'Su cuenta ha sido verificada correctamente. Ya puede iniciar sesión.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async alertNotVerified() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Cuenta no verificada',
      message: 'Su cuenta no ha sido verificada. Por favor, ingrese a su correo electrónico y verifique su cuenta.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async recargarPagina() {
    window.location.reload();
  }

  async redirectToFinal() {
    await this.verifing();

    setTimeout(() => {
      this.router.navigateByUrl('/login');
    }, 1000);

  }

}
