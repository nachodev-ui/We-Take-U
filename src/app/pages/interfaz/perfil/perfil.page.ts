/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

import { UserI } from 'src/app/models/models';

import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

import { AvatarService } from 'src/app/services/avatar.service';

import { AuthService } from 'src/app/services/auth.service';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  /*Inicializar el uid como null*/
  uid: string = null;

  /*Variable para desplegar info*/
  infoUser: UserI = null;

  user = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private database: FirebaseService,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private avatarService: AvatarService,
    private loadingCtrl: LoadingController
    ) { }

  async ngOnInit() {

    this.authService.stateUser().subscribe( res => {
      this.getUid();
    });

    this.avatarService.getUserProfile().subscribe((data) => {
      this.infoUser;
    });
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Photos, // Camera, Photos or Prompt
    });

    console.log(image);

    if (image) {
      const loading = await this.loadingCtrl.create();
      await loading.present();

      const result = await this.avatarService.uploadImage(image);
      loading.dismiss();

      if (!result) {
        const alert = await this.alertCtrl.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }

  }

  async getUid() {
    const uid = await this.authService.getUid();

    if (uid) {
      this.uid = uid;

      this.getInfoUser();

    } else {
      this.uid = null;
    }
  }

  async editProfile() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('PROFILE.profileCtrl.header'),
      mode: 'ios',
      cssClass: 'alertEditProfile',
      inputs: [
        {
          name: 'direccion',
          type: 'text',
          placeholder: this.translate.instant('PROFILE.profileCtrl.placeholder')
        },
        {
          name: 'phone',
          type: 'number',
          placeholder: 'Teléfono',
          value: this.infoUser.celular
        }
      ],
      buttons: [
        {
          text: this.translate.instant('PROFILE.profileCtrl.btnCancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: ()=> {
          }
        },
        {
          text: this.translate.instant('PROFILE.profileCtrl.btnChange'),
          handler: (ev) => {
            this.savePhone(ev.phone);
            this.addDirection(ev.direccion);
          }
        },
      ]
    });

    await alert.present();
  }

  async editImage() {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('PROFILE.imgCtrl.header'),
      mode: 'ios',
      inputs: [
        {
          name: 'imagen',
          type: 'text',
          placeholder: this.translate.instant('PROFILE.imgCtrl.placeholder')
        },
      ],
      buttons: [
        {
          text: this.translate.instant('PROFILE.imgCtrl.btnCancel'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: ()=> {

          }
        },
        {
          text: this.translate.instant('PROFILE.imgCtrl.btnChange'),
          handler: (ev) => {
            this.uploadPhoto(ev.imagen);
          }
        },
      ]
    });

    await alert.present();
  }

  async userUpdated() {
    const alert = await this.alertCtrl.create({
      mode: 'ios',
      header: this.translate.instant('PROFILE.alertUpd.header'),
      buttons: [this.translate.instant('PROFILE.alertUpd.btnOk')]
    });
    await alert.present();
  }

  /*Tomar los datos del usuario autenticado*/
  getInfoUser() {
    const path = 'Usuarios';
    const id = this.uid;

    this.database.getDoc<UserI>(path, id).subscribe( credentials => {
      if (credentials) {
        this.infoUser = credentials;
      }
    });

  }

  /*Metodos de modificacion de datos*/
  savePhone(celularInput: string) {
    const path = 'Usuarios';
    const id = this.uid;

    const updateDoc = {
      celular: celularInput
    };

    this.database.updateDoc(path, id, updateDoc).then (  () => {
    });

  }

  addDirection(direccionInput: string) {
    const path = 'Usuarios';
    const id = this.uid;

    const updateDoc = {
      direccion: direccionInput
    };

    this.database.updateDoc(path, id, updateDoc).then (  () => {
      this.userUpdated();
    });
  }

  uploadPhoto(imgInput: string) {
    const path = 'Usuarios';
    const id = this.uid;

    const updateDoc = {
      imagen: imgInput
    };

    this.database.updateDoc(path, id, updateDoc).then (  () => {
      this.userUpdated();
    });
  }

  returnPsg() {
    if (this.infoUser.perfil === 'Pasajero') {
      this.router.navigateByUrl('interfaz/pasajero');
    } else {
      this.router.navigateByUrl('interfaz/conductor');
    }
  }

}
