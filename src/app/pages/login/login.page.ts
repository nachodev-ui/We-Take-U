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

  infoUser: UserI = null;

  loged = false;

  /*Rol menu*/
  rol: 'Pasajero' | 'Conductor';

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

      } else {
        this.loged = false;
      }
    });

  }

  ngOnInit() {
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

  async camposVacios() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Error',
      message: 'Por favor ingrese su correo y contraseña.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async emailNoRegistrado() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Error',
      message: 'El correo no se encuentra registrado, por favor registrese.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async usuarioNoAutenticado() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Usuario no autenticado',
      message: 'Por favor, visite su direccion de correo electrónico para verificar su cuenta.',
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

  async login() {

    await this.openLoading();

    const validForm = await this.auth.login(this.formularioLogin.value.email, this.formularioLogin.value.password).catch( async err => {

      if (this.formularioLogin.value.email === '' || this.formularioLogin.value.password === '') {
        await this.camposVacios();
      } else if (err.code === 'auth/user-not-found') {
        await this.emailNoRegistrado();
      }

    });

    if (validForm) {

      if (this.rol === 'Pasajero') {

        await this.router.navigate(['interfaz/pasajero']);

      } else if (this.rol === 'Conductor') {

        setTimeout(() => {
          this.router.navigate(['interfaz/conductor']);
        }, 1000);
      }

      await this.closeLoading();

    }

  }

  async googleLogin() {
    await this.openLoading();

    this.auth.googleLogin().then( async () => {
      this.router.navigate(['interfaz/pasajero']);
    }
    ).catch( async err => {
      console.log('Error de sistema', err);
    });

  }

  async githubLogin() {
    await this.openLoading();

    const validForm = await this.auth.githubLogin().catch( async err => {
      this.alertGithubError();
    });

    if (validForm) {
      this.router.navigate(['interfaz/pasajero']);
    }

  }

}

