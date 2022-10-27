import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { AlertController, LoadingController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  signupForm: FormGroup;

  constructor(
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private auth: AuthService,
    private database: FirebaseService,
    private builder: FormBuilder,
    private translate: TranslateService
    ) {
      this.signupForm = this.builder.group({
        nombre: [''],
        apellido: [''],
        email: ['', Validators.compose([Validators.email, Validators.required])],
        uid: [''],
        password: ['', Validators.required],
        password2: ['', Validators.compose([Validators.minLength(6), Validators.required])],
        celular: ['', Validators.compose([Validators.minLength(10), Validators.required])],
        direccion: [''],
        imagen: ['https://ajisenramenpanama.com/wp-content/uploads/2020/07/user_icon.png'],
        perfil: 'Pasajero',
      });
    }

  ngOnInit() {
  }

  async valideIfEmailAlreadyExists() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'El correo ya existe',
      message: '¿Olvidó su contraseña? Intente recuperarla',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: 'Recuperar',
          cssClass: 'primary',
          handler: () => {
            this.router.navigate(['reset-password']);
          }
        }
      ],
    });

    await alert.present();
  }

  async EmailOrPasswordAreNotValid() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Registro fallido',
      message: 'El correo que está intentando ingresar no es válido, por favor, intente nuevamente.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async loadingRegister() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: 'Registrando...',
      duration: 1000,
    });
    await loading.present();
  }

  async sentEmailVerification() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Correo de verificación enviado',
      message: 'Se ha enviado un correo de verificación a su cuenta de correo electrónico. Por favor, verifique su cuenta.',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async passwordsAreNotEqual() {
    const alert = await this.alertCtrl.create({
      header: 'Registro fallido',
      message: 'Las contraseñas no coinciden, por favor, intente de nuevo',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async celularNoValido() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Celular no válido',
      message: 'El número de celular debe tener 10 dígitos',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async correoVacio() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: 'Correo vacío',
      message: 'Por favor, ingrese su correo electrónico',
      buttons: ['OK'],
    });

    await alert.present();
  }

  async registrar() {

    const validForm = await this.auth.registerUser(this.signupForm.value.email, this.signupForm.value.password).catch( err => {

      if (err.code === 'auth/email-already-in-use') {
        this.valideIfEmailAlreadyExists();
      } else if (err.code === 'auth/invalid-email') {
        this.EmailOrPasswordAreNotValid();
      } else if (this.signupForm.value.celular.length < 9) {
        this.celularNoValido();
      } else if (this.signupForm.value.password !== this.signupForm.value.password2) {
        this.passwordsAreNotEqual();
      } else if (this.signupForm.value.email === '') {
        this.correoVacio();
      }

    });

    if (validForm) {
      const path = 'Usuarios';
      const id = validForm.user.uid;

      this.loadingRegister();

      this.signupForm.value.uid = id;
      this.signupForm.value.password = null;
      this.signupForm.value.password2 = null;
      this.database.createDoc(this.signupForm.value, path, id);

      this.auth.accountVerification();

      setTimeout(() => {
        this.sentEmailVerification();
        this.router.navigate(['verificate']);
      }, 2300);
    }
  }

  async loadingConductor() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: this.translate.instant('U_REGISTER.DR_ALERT.LOADING.message'),
      duration: 1000,
    });
    await loading.present();
  }

  async modoConductor() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('U_REGISTER.DR_ALERT.header'),
      message: this.translate.instant('U_REGISTER.DR_ALERT.message'),
      buttons: [
        {
          text: this.translate.instant('U_REGISTER.DR_ALERT.no'),
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.translate.instant('U_REGISTER.DR_ALERT.yes'),
          cssClass: 'primary',
          handler: () => {
            this.loadingConductor();
            setTimeout(() => {
              this.router.navigate(['registro-conductor']);
            }, 1500);
          }
        }
      ]
    });
    await alert.present();
  }

}


