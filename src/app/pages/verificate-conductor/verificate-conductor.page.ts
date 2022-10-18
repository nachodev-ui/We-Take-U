import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-verificate-conductor',
  templateUrl: './verificate-conductor.page.html',
  styleUrls: ['./verificate-conductor.page.scss'],
})
export class VerificateConductorPage implements OnInit {

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router
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

  async redirectToInfo() {
    await this.verifing();

    setTimeout(() => {

      this.alertCorrectVerified();

      this.router.navigateByUrl('/info-vehiculo');
    }, 1000);

  }

}
