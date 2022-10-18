import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { AlertController, LoadingController, NavController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

import { ConductorI, UserI } from 'src/app/models/models';
import { FirebaseService } from 'src/app/services/firebase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formularioLogin: FormGroup;

  loged = false;

  /*Rol menu*/
  rol: 'Pasajero' | 'Conductor' | 'Administrador';

  constructor(
    private router: Router,
    public builder: FormBuilder,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private auth: AuthService,
    private database: FirebaseService) {

    /* Validaciones para un formulario */
    this.formularioLogin = this.builder.group
    ({
      'email': new FormControl('', Validators.compose([Validators.email, Validators.required])),
      'password': new FormControl('', Validators.required),
    });

    this.auth.stateUser().subscribe( res => {
      if(res) {
        this.loged = true;

        /*Datos Pasajeros*/
        this.getUserData(res.uid);

        /*Datos Conductor*/
        this.getConductorData(res.uid);

      } else {
        this.loged = false;
      }
    });

  }

  ngOnInit() {

    this.auth.stateUser().subscribe( res => {
      if(res) {
        this.loged = true;

        /*Datos Pasajeros*/
        this.getUserData(res.uid);

        /*Datos Conductor*/
        this.getConductorData(res.uid);

      } else {
        this.loged = false;
      }
    });
  }

  backToHome() {
    this.router.navigate(['home']);
  }

  signUp() {
    this.router.navigate(['registro']);
  }

  resetPass() {
    this.router.navigate(['reset-password']);
  }

  /*Alerta de error en caso de error al loguearse*/
  async alertaError() {

    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Error',
      message: 'Correo o contraseña incorrectos, por favor intente de nuevo.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async alertGoogleError() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Error',
      message: 'No se pudo iniciar sesión con Google, por favor intente de nuevo.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async alertGithubError() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Error',
      message: 'No se pudo iniciar sesión con Github, por favor intente de nuevo.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async openLoading() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Cargando. . .',
      duration: 100
    });
    return await loading.present();
  }

  async closeLoading() {
    return await this.loadingCtrl.dismiss();
  }

  async login() {

    await this.openLoading();

    const validForm = await this.auth.login(this.formularioLogin.value.email, this.formularioLogin.value.password).catch( async err => {
      this.closeLoading();
      await this.alertaError();
    });

    if (validForm) {

      if (this.rol === 'Pasajero') {
        this.router.navigate(['interfaz/pasajero']);
      } else if (this.rol === 'Conductor') {
        this.router.navigate(['interfaz/conductor']);
      } else {

      }

    };
  }

  async emailNotVerified() {

  }

  async googleLogin() {
    await this.openLoading();

    this.auth.googleLogin().then( async () => {
      this.router.navigate(['interfaz']);
    }
    ).catch( async err => {
      this.closeLoading();
      await this.alertGoogleError();
    });

  }

  async githubLogin() {
    await this.openLoading();

    const validForm = await this.auth.githubLogin().catch( async err => {
      this.alertGithubError();
    });

    if (validForm) {
      this.router.navigate(['interfaz']);
    }

  }

  getUserData(uid: string) {
    const path = 'Usuarios';
    const id = uid;
    this.database.getDoc<UserI>(path, id).subscribe( res => {
      console.log('datos ->', res);
      if (res) {
        this.rol = res.perfil;
      }
    });
  }

  getConductorData(uid: string) {
    const path = 'Conductores';
    const id = uid;
    this.database.getDoc<ConductorI>(path, id).subscribe( res => {
      console.log('datos ->', res);
      if (res) {
        this.rol = res.perfil;
      }
    });
  }

}

