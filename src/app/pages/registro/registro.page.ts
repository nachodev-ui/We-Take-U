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
        nombre: ['', Validators.required],
        apellido: ['', Validators.required],
        email: ['', Validators.compose([Validators.email, Validators.required])],
        uid: [''],

        password: ['', [Validators.required, Validators.minLength(6)]],
        password2: ['', Validators.compose([Validators.minLength(6), Validators.required])],

        celular: ['', Validators.compose([Validators.minLength(9), Validators.maxLength(9), Validators.required])],
        direccion: [''],
        photoURL: ['https://ajisenramenpanama.com/wp-content/uploads/2020/07/user_icon.png'],
        perfil: 'Pasajero',
      },
      {
        validator: this.Mustmatch('password', 'password2'),
      });
    }

  ngOnInit() {
  }

  get rf() {
    return this.signupForm.controls;
  }

  Mustmatch(password: any, password2: any) {
    return (formGroup: FormGroup) => {

      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[password2];

      if (matchingControl.errors && !matchingControl.errors['Mustmatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ Mustmatch: true });
      } else {
        matchingControl.setErrors(null);
      }

    };
  }

  async valideIfEmailAlreadyExists() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('D_REGISTER.EMEXISTS.header'),
      message: this.translate.instant('D_REGISTER.EMEXISTS.message'),
      buttons: [
        {
          text: this.translate.instant('D_REGISTER.EMEXISTS.btnCancel'),
          role: 'cancel',
          cssClass: 'secondary'
        },
        {
          text: this.translate.instant('D_REGISTER.EMEXISTS.btnRecover'),
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
      header: this.translate.instant('U_REGISTER.EMERROR.header'),
      message: this.translate.instant('U_REGISTER.EMERROR.message'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async loadingRegister() {
    const loading = await this.loadingCtrl.create({
      mode: 'ios',
      message: this.translate.instant('U_REGISTER.RLOADING.message'),
      duration: 1000,
    });
    await loading.present();
  }

  async sentEmailVerification() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('U_REGISTER.EMVERF.header'),
      message: this.translate.instant('U_REGISTER.EMVERF.message'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async passwordsAreNotEqual() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('U_REGISTER.PAERROR.header'),
      message: this.translate.instant('U_REGISTER.PAERROR.message'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async celularNoValido() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('U_REGISTER.CELERROR.header'),
      message: this.translate.instant('U_REGISTER.CELERROR.message'),
      buttons: ['OK'],
    });

    await alert.present();
  }

  async correoVacio() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('U_REGISTER.EMVACIO.header'),
      message: this.translate.instant('U_REGISTER.EMVACIO.message'),
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


