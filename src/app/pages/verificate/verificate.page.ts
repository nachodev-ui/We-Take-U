import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-verificate',
  templateUrl: './verificate.page.html',
  styleUrls: ['./verificate.page.scss'],
})
export class VerificatePage implements OnInit {

  constructor(
    private router: Router,
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
      message: 'Su cuenta ha sido verificada correctamente. Ahora ingrese su medio de transporte por favor.',
      buttons: ['OK']
    });
    await alert.present();
  }

  async redirectToFinal() {
    await this.verifing();

    setTimeout(async () => {

      this.alertCorrectVerified();

      await this.router.navigateByUrl('info-vehiculo');
    }, 1500);

  }

}
